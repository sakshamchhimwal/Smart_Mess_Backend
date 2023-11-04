# User Routes

## User Time Table

This route can be used to get the timetable of the user of a particular mess.

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


## User Notifications

This route is used to get the notifications of a particular user.

### Request

- Method: `GET`
- Endpoint: `/api/dashboard/notifications`
- Request Body: ```Empty```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 :
```json
{}
```
- 501 : Internal Server Error.


## User Food Review

This route is used to get the review of a user of the food items he rated on that particualr day.

### Request

- Method: `GET`
- Endpoint: `/api/dashboard/getFoodReview`
- Request Body: `Empty`
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 :
```
{}
```
- 204 : `[]`
- 404 : `No User Exixts`
- 501 : `Internal Server Error`


## Give Rating

This route is used to only give the rating of a particular food item.

### Request

- Method: `POST`
- Endpoint: `/api/dashboard/giveRating`
- Request Body: 
```json
{
    "foodId":"<_id in the foodItems table>",
    "rating":"<rating <=5 >"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `Updated`
- 404 : `User Not Found`
- 501 : `Internal Server Error`

## Submit Feedback

This route is used to submit the feedback form.

### Request

- Method: `POST`
- Endpoint: `/api/dashboard/submitFeedback`
- Request Body: 
```json
{
    "FormId":"",
    "BreakfastRating":"",
    "LunchRating":"",
    "DinnerRating":"",
    "SnacksRating":"",
    "Comments":"",
    "MessServiceRating":"",
    "HygieneRating":"",
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `Feedback Submitted`
- 501 : `Internal Server Error`


## Add Notifications Web

This route is used to add the web notifications that are sent by the manager.

### Request

- Method: `POST`
- Endpoint: `/api/addNotificationToken/web`
- Request Body: 
```json
{
    "notification_token":"<firebase notfication token>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `<token>`
- 500 : `Some Error Occured`

## Add Notifications Android --- TBD

This route is used to add the web notifications that are sent by the manager.

### Request

- Method: `POST`
- Endpoint: `/api/addNotificationToken/web`
- Request Body: 
```json
{
    "notification_token":"<firebase notfication token>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `<token>`
- 500 : `Some Error Occured`

## Make Notification Read

This route is used to make a particular notification by the user read.

### Request

- Method: `POST`
- Endpoint: `/api/dashboard/makeRead`
- Request Body: 
```json
{
    "notifId":"<notification id>"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `Read`
- 404 : `Unexpected Error`
- 501 : `Internal Server Error`

## Make All Notification Read

This route is used to make all notification by the user read.

### Request

- Method: `POST`
- Endpoint: `/api/dashboard/makeAllRead`
- Request Body: `Empty`
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `Read`
- 500 : `Internal Server Error`

## Submitting The Food Review

This route is used to give rating and comments to a particular food item.

### Request

- Method: `POST`
- Endpoint: `/api/dashboard/submitFoodReview`
- Request Body: 
```json
{
    "foodId":"<_id in the foodItems table",
    "rating":"< rating <=5 >",
    "comments": "string"
}
```
- Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response: 

- 200 : `FeedBack Added / Feedback Created And FeedBack Added`
- 501 : `Internal Server Error`