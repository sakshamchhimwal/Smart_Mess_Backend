# Smart_Mess_Backend API Documentation
## /signup
### Request

- Method: `POST`
- Endpoint: `/oauth/signup`
- Request Body:
```json
{
    "authCode": "Google-authentication-code",
    "userAgent": "AndroidApp/WebApp",
}
```
- `authCode` is the code received from Google Authorization Server.
- `userAgent` is the platform from which the request is being made, make sure to send the correct value.

### Response

- Success (201 Created): Signup successful. A JWT token is set as a secure HTTP cookie.
- Error (400 Bad Request): Invalid request due to missing/invalid userAgent or authCode.
- Error (500 Internal Server Error): Internal server error occurred while processing the request.

2. /login
3. /user/dashboard
4. /manager/dashboard
5. /admin/dashboard
6. /user/dashboard/attendance
7. /user/dashboard/payments
8. /user/dashboard/time_table (+ongoing_meal)(unauthorized)
9. /user/notifications
10. /user/submit_feedback
11. /manager/dashboard/edit_time_table
12. /manager/dashboard/payments (segregation for the front end team)
13. /manager/dashboard/ratings
14. /manager/dashboard/make_announcement
15. /admin/dashboard/ratings
16. /admin/dashboard/student_reactions
17. /admin/dashboard/complaints
18. /guest/time_table
