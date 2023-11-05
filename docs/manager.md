# Manger Routes

## Listing Time Table

This routes return the timetable to the manager

### Request

- Method: `GET`
- Endpoint: `/api/dashboard/timetable`
- Request Body: ```Empty```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 :
```
[
    {
        "id": "6513475a74afccfe42cf26d7",
        "Day": "Monday",
        "Type": "Breakfast",
        "Items": [
            {
                "_id": "65125b545c1c58bf8ee40019",
                "Name": "Poha",
                "Category": 1,
                "Image": "https://images.pexels.com/photos/13063292/pexels-photo-13063292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            {
                "_id": "65125b545c1c58bf8ee4001a",
                "Name": "Sev/Namkeen",
                "Category": 2,
                "Image": "https://img.freepik.com/free-photo/gourmet-lifestyle-cocina-yummy-foodie_1350-49.jpg?w=900&t=st=1695621799~exp=1695622399~hmac=0f8b02715e42161ea49b02c2a5c7b50b9572a6959f694887d69a8c2e454da706"
            },
            ...]
      ...}
...]
```
- 216 : The data is returned from the cache.
- 404 : The given user is not found.
- 501 : Internal Server Error.

## Listing All Food Items

This route return all the food items that are existing. Can be upgraded to mess wise view once more messe are launched.

### Request

- Method: `GET`
- Endpoint: `/api/dashboard/getAllFoodItems`
- Request Body: `Empty`
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response
- 200 : 
```
[
    {
        "Name": " GREEN & RED  CHUTNEY",
        "Id": "65125b545c1c58bf8ee40047",
        "Img": "https://www.indianveggiedelight.com/wp-content/uploads/2021/07/green-chutney-featured.jpg"
    },
    {
        "Name": " KASHMIRI DUM ALLO",
        "Id": "65125b545c1c58bf8ee40048",
        "Img": "https://www.vegrecipesofindia.com/wp-content/uploads/2012/04/kashmiri-dum-aloo-recipe-11a.jpg"
    },...]
```
- 501 : Internal Server Error.

## Rating for a praticular item

This route returns the item rating of the requested item.

### Request
- Method: `POST`
- Endpoint: `/api/dashboard/getItemRating`
- Request Body: 
```json
{
  "itemId":"<id of the food listed in the MongoDD database. (_id field)>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response
- 200 : 
```json
{
  [
    {
        "_id": "6517bafd1a9f243c6958837b",
        "Mess": "64fe052e15720924b85bd58d",
        "FoodItem": "65125b545c1c58bf8ee4001c",
        "Rating": 3.4,
        "NumberOfReviews": 5,
        "__v": 0
    },
    {
        "_id": "6517e98d74b8afdddecea6e8",
        "Mess": "64fe052e15720924b85bd58d",
        "FoodItem": "65125b545c1c58bf8ee40019",
        "Rating": 3.730769230769231,
        "NumberOfReviews": 26,
        "__v": 0
    },...]
} or "Item not Rated Yet"
```
- 404 : `User is not found`
- 501 : `Internal Server Error`

## Rating Time Series

This route returns the variation of ratings on every week basis.

### Request
- Method: `POST`
- Endpoint: `/api/dashboard/getTimeSeries`
- Request Body: 
```json
{
  "itemId":"<id of the food listed in the MongoDD database. (_id field)>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response
- 200 : 
```
[
    {
        "_id": "652f67a14273d1f88e38f04d",
        "Date": "2023-09-12T18:30:00.000Z",
        "FoodItemId": "65125b545c1c58bf8ee40045",
        "Rating": 5,
        "NoOfReviews": 2,
        "__v": 0
    },
    {
        "_id": "652f67ad4273d1f88e38f050",
        "Date": "2023-09-19T18:30:00.000Z",
        "FoodItemId": "65125b545c1c58bf8ee40045",
        "Rating": 4.2,
        "NoOfReviews": 10,
        "__v": 0
    },...]
```
- 404 : `User is not found`
- 501 : `Internal Server Error`

## Add Food To Time Table

This route is used to add food to a particular mess menu.

### Request
- Method: `PATCH`
- Endpoint: `/api/dashboard/addTimeTable`
- Request Body:
```json
{
  "day":"Monday/Tuesday/...",
  "mealType":"Breakfast/Lunch/Snacks/Dinner",
  "mealItem":"<item _id in the food items table>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
### Response
- 200 : `Inserted`
- 404 : `User is not found`
- 501 : `Internal Server Error`

## Creating New Food Item

This route is for the manager to create a new food item in the list of all the pre-existing food items.

### Request
- Method: `PATCH`
- Endpoint: `/api/dashboard/createFoodItem`
- Request Body:
```json
{
  "name":"<name of the food item>",
  "image":"<image link of the food item>",
  "category":"1/2/3"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
### Response
- 200 : `Inserted`
- 404 : `User is not found`
- 501 : `Internal Server Error`

## Getting the result of a particular feedback form

This route is used to get the submission of the feedback form that was filled by a particular user.

### Request
- Method: `GET`
- Endpoint: `/api/dashboard/feedbackFormSubmissions/:formID`
- Request Body:`Empty`
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
- Request Params: `<formId>`
### Response
- 200 : 
```json
{}
```
- 501 : `Internal Server Error`

## Getting all the submitted feedback forms

This route is used to get all the feedback forms that were submitted by the users.

### Request
- Method: `GET`
- Endpoint: `/api/dashboard/allFeedbackForms`
- Request Body:`Empty`
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
### Response
- 200 : 
```json
{}
```
- 501 : `Internal Server Error`

## Floating FeedBack forms

This route is used by the manager to float the feedback form for all the users.

### Request
- Method: `POST`
- Endpoint: `/api/dashboard/floatFeedbackForm`
- Request Body:
```json
{
  "title":"<title of the form",
  "description":"<description of the feedback form>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
### Response
- 200 : `Notification Sent`
- 501 : `Internal Server Error`

## Making Announcements

This route is used by the manager to make announcements.

### Request
- Method: `POST`
- Endpoint: `/api/dashboard/makeAnnouncement`
- Request Body:
```json
{
  "title":"<title of the announcement>",
  "description":"<description of the announcement>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```
### Response
- 200 : `Notification Sent`
- 501 : `Internal Server Error`