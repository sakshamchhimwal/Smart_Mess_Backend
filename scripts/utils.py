import datetime
import os
from dotenv import load_dotenv
load_dotenv()


app_key = os.getenv('RECIPIE_APP_KEY')
app_id = os.getenv('RECIPIE_APP_ID')
recipie_base_url = os.getenv('RECIPIE_BASE_URL')
food_price_base_url = os.getenv('FOOD_PRICE_BASE_API')
fallback_url = os.getenv('FALLBACK_API')


def generateRecipieURL(foodItem, mealType) -> str:
    params = {
        "type": "public",
        "q": foodItem,
        "app_id": app_id,
        "app_key": app_key,
        "mealType": mealType
    }
    return (recipie_base_url, params)


def generatePriceURL(foodItemName: str) -> str:
    params = {
        "ss": f'food {foodItemName}',
        "com-cf": "nl",
        "res": "RC3",
        "stype": "attr=1|attrS",
        "Mspl": "0",
        "qry_typ": "P",
        "City": "dharwad",
        "cq": "dharwad"
    }
    return (food_price_base_url, params)

def generateFallbackURL(foodItemName: str) -> str:
    currUrl = fallback_url
    currUrl = currUrl.format(foodItemName)
    return currUrl


def parseRecipie(items: list[str]) -> dict[str, float]:
    foodItemQuantity = []

    for item in items:
        foodItemQuantity.append({
            "name": item['food'],
            "weight": item['weight']
        })

    return foodItemQuantity

def logger(filename="logs.log", text=""):
    with open(filename,"a") as f:
        f.write(f'[{str(datetime.datetime.today())}]\n')
        f.write(text)
        f.write("\r\n")