import { Request, Response } from 'express';
import { getGoogleOauthTokenWeb, getGoogleOauthTokenAndroid } from '../services/getGoogleOauthToken';
import { getGoogleUser } from '../services/getGoogleUser';
import user_model from '../models/user';
import { createSession } from '../services/createSession';
import { JWTLoadData } from '../Interface/interfaces';


const signupHandler = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const authCode = req.body.authCode;
        if (!authCode) return res.status(400).send("Auth Code not provided");
        const userAgent = req.body.userAgent;
        if (userAgent === 'AndroidApp') {
            // Handle Android signup
            try {
                const tokenInfo = await getGoogleOauthTokenAndroid(authCode);
                console.log(tokenInfo);
                try {
                    const userInfo = await getGoogleUser(tokenInfo);
                    console.log(userInfo);
                } catch (err) {
                    console.log(err);
                    res.status(500).send("Some Error Occured while fetching user info");
                }
            } catch (err) {
                console.log(err);
                res.status(500).send("Some Error Occured while fetching token info");
            }
        } else if (userAgent === 'WebApp') {
            // Handle web signup
            try {
                const tokenInfo = await getGoogleOauthTokenWeb(authCode);
                console.log(tokenInfo);
                try {
                    const userInfo = await getGoogleUser(tokenInfo);
                    console.log(userInfo);
                    //check if user already exists
                    const user = await user_model.findOne({ Email: userInfo.email });
                    if (user) return res.status(400).send("User Already Exists");
                    //create new user
                    const newUser = await user_model.create({
                        Username: userInfo.name,
                        Email: userInfo.email,
                        Phone_Number: 0,
                        Role: 0,
                        First_Name: userInfo.given_name,
                        Last_Name: userInfo.family_name,
                        Image: userInfo.picture,
                        Last_Login: Date.now()
                    });
                    //create session
                    const payload: JWTLoadData = {
                        user: {
                            email: userInfo.email,
                            role: 0,
                            time: Date.now(),
                        },
                    };
                    createSession(payload, res);
                    //send response
                    return res.status(201).send("Signup Successful");
                } catch (err) {
                    console.log(err);
                    return res.status(500).send("Some Error Occured while fetching user info");
                }
            } catch (err) {
                console.log(err);
                return res.status(500).send("Some Error Occured while fetching token");
            }
        } else {
            // Handle other scenarios or return an error
            return res.status(400).send("Invalid User Agent");
        }
    } catch {
        return res.status(500).send("Some Error Occured");
    }
}

//yet to be implemented
const loginHandler = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send("Login Successful");
}

export { signupHandler, loginHandler };