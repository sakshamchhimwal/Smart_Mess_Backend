## Signup Route

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
