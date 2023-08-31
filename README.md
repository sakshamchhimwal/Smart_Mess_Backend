# Smart_Mess_Backend API Documentation

## /signup

### Request

- Method: `POST`
- Endpoint: `/oauth/signup`
- Request Body:

```json
{
  "authCode": "Google-authentication-code",
  "userAgent": "AndroidApp/WebApp"
}
```

- `authCode` is the code received from Google Authorization Server.
- `userAgent` is the platform from which the request is being made, make sure to send the correct value.

### Response

- Success (201 Created): Signup successful. A JWT token is set as a secure HTTP cookie.
- Error (400 Bad Request): Invalid request due to missing/invalid userAgent or authCode.
- Error (500 Internal Server Error): Internal server error occurred while processing the request.

## /login

## /user/dashboard

### Request

- Method: `GET`
- Endpoint: `/user/dashboard`
- Request Body:

```json
{}
```

### Response

- Success(200): Returns all the user details in JSON format directly extracted from the MongoDB database.
- Not Found(404): The given user was not found;
- Error(500): Internal Server Error

## /manager/dashboard

## /admin/dashboard

## /user/dashboard/attendance

## /user/dashboard/payments

## /user/dashboard/timetable

### Request

- Method: `GET`
- Endpoint: `/user/dashboard/timetable`
- Request Body:

```json
{}
Data is extracted from the cookie
```

### Response

- Success(200): Returns all the meals that are served in the mess irrespective of the time at which they are served.
- Not Found(404): If the given mess is not found(unlikely to happen if the choice is from a drop down list);
- Error(500): Internal Server Error

## /user/notifications

10. /user/submit_feedback
11. /manager/dashboard/edit_time_table
12. /manager/dashboard/payments (segregation for the front end team)
13. /manager/dashboard/ratings
14. /manager/dashboard/make_announcement
15. /admin/dashboard/ratings
16. /admin/dashboard/student_reactions
17. /admin/dashboard/complaints

## /guestTimeTable

### Request

- Method: `GET`
- Endpoint: `/guestTimeTable`
- Request Body:

```json
{
  "mess": "String"
}
```

- `mess`: The code number of the mess in which the guest is going to eat.

### Response

- Success(200): Returns all the meals that are served in the mess irrespective of the time at which they are served.
- Not Found(404): If the given mess is not found(unlikely to happen if the choice is from a drop down list);
- Error(500): Internal Server Error

## /guestCurrentMeal

### Request

- Method: `GET`
- Endpoint: `/guestCurrentMeal`
- Request Body:

```json
{
  "mess": "String",
  "date": "Date"
}
```

- `mess`: The code number of the mess in which the guest is going to eat.
- `date`: Send the Date.now() JS function without prompting the user for it.

### Response

- Success(200): Returns the meal that are being served at that particular time at that particular day.
- Not Found(404): If the given mess is not found(unlikely to happen if the choice is from a drop down list);
- Error(500): Internal Server Error
