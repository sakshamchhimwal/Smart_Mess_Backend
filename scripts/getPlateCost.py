import math
import requests
import json
from bs4 import BeautifulSoup
import os
from utils import generateFallbackURL, generatePriceURL, generateRecipieURL, logger, parseRecipie

script_dir = os.path.dirname(__file__)

def getPlateCosts():
    try:
        file_path = os.path.join(script_dir, "timetable.json")
        dataFile = open(file_path, "r")
        dataJSON = json.load(dataFile)
        foodCost = []

        for meal in dataJSON:
            mealType = meal['Type']
            mealItems = []
            for item in meal['Items']:
                if item['Category'] == 1:
                    mealItems.append(item['Name'])

            recipies = [getFoodRecipie(foodItem, mealType) for foodItem in mealItems]
            logger("logs.log", json.dumps(recipies, indent=4))
            currCost = []
            for mealRecipie in recipies:
                for foodItem in mealRecipie:
                    currCost.append(getFoodCost(foodItemName=foodItem['name'], quantity=foodItem['weight']))
            foodCost.append({
                "mealType": mealType,
                "costs": list(filter(None, currCost))
            })

        return foodCost

    except Exception as e:
        logger("error.log", f'[getPlateCosts] Error occured due to {e}')


def getFoodRecipie(foodItem, mealType):
    try:
        recpieURL, params = generateRecipieURL(foodItem, mealType)
        response = requests.get(url=recpieURL, params=params).json()["hits"][0]['recipe']["ingredients"]
        recipie = parseRecipie(response)
        return recipie

    except Exception as e:
        logger("error.log", f'[getFoodRecipie] Error occured due to {e}')


def fallbackGetFoodCost(foodItemName, quantity):
    try:
        url = generateFallbackURL(foodItemName)
        response = requests.get(url=url).text

        parsedHTML = BeautifulSoup(response, "html.parser").text

        text = parsedHTML.encode("ascii", "ignore").decode("ascii").replace('\n\n', '').replace(' ', '').replace('\t', '')
        idx = text.find("AveragePrice")
        text = text[idx:]
        price = float(text.split('\n')[1].split('/')[0])

        return {
            "name": foodItemName,
            "cost": quantity * (price / 100000.0)
        }

    except Exception as e:
        logger("error.log", f'[fallbackGetFoodCost] Error occured due to {e} {foodItemName, quantity}')


def getFoodCost(foodItemName, quantity):
    try:
        foodPriceUrl, params = generatePriceURL(foodItemName)
        responseHTML = BeautifulSoup(requests.get(url=foodPriceUrl, params=params).text, "html.parser")
        all_prices = responseHTML.find_all("script")[2]
        all_prices = all_prices.text.split("window.__INITIAL_DATA__ =")[1].strip().split("};")[0] + "}"
        all_prices = json.loads(all_prices)
        all_food_data = []
        for x in all_prices["results"]:
            if foodItemName.lower() in x["proddata"]["title"]["name"].lower():
                all_food_data.append({
                    "name": x["proddata"]["title"]["name"],
                    "price": x["proddata"]["price"]["unchngPrice"],
                    "unit": x["proddata"]["price"]["unitType"]
                })
        all_food_data = sorted(all_food_data, key=lambda x: float(x["price"]))

        netCost = 0.0
        weight = math.e
        currIdx = 0

        for food_data in all_food_data:
            if food_data["price"] != 0:
                if food_data["unit"].lower() == "kg" or food_data["unit"].lower() == "kilogram":
                    currPrice = float(food_data["price"]) / float(1000)
                    currWeight = weight**currIdx
                    netCost = netCost + currWeight * (currPrice * quantity)
                    currIdx = currIdx - 1

        logger("logs.log", json.dumps(all_food_data, indent=4))

        return {
            "name": foodItemName,
            "cost": netCost
        }

    except Exception as e:
        logger("error.log", f'[getFoodCost] Error occured due to {e} {foodItemName, quantity}')
        logger("error.log", f'[getFoodCost] Going for fallback')

        return fallbackGetFoodCost(foodItemName=foodItemName, quantity=quantity)


plateCost = getPlateCosts()
logger("platecost.json", json.dumps(plateCost, indent=4))
