import { Request, Response } from 'express';
import { getGoogleOauthTokenWeb, getGoogleOauthTokenAndroid } from '../services/getGoogleOauthToken';
import { getGoogleUser } from '../services/getGoogleUser';
import user_model from '../models/user';
import { createSession } from '../services/createSession';
import { JWTLoadData } from '../Interface/interfaces';

const webSigninHandler = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const {authCode} = req.body;
        console.log(req.body);
        if(!authCode) return res.status(400).send("authCode not provided");
        // Handle web signup
        try {
            const tokeninfo = await getGoogleOauthTokenWeb({authCode});
            try {
                const userInfo = await getGoogleUser(tokeninfo);
                //check if user already exists
                let user = await user_model.findOne({ Email: userInfo.email });
                if(!user){
                    //create new user
                    const newUser = await user_model.create({
                        Username: userInfo.name,
                        Email: userInfo.email,
                        Phone_Number: 0,
                        Role: "user",
                        First_Name: userInfo.given_name,
                        Last_Name: userInfo.family_name,
                        Image: userInfo.picture,
                        Last_Login: Date.now()
                    });
                    user = newUser;
                }
                // console.log(user);
                //create session
                const payload: JWTLoadData = {
                    user: {
                        email: user.Email,
                        role: user.Role as string,
                        time: Date.now(),
                    },
                };
                const token= createSession(payload);
                return res.status(201).send({token});
            } catch (err) {
                console.log(err);
                return res.status(500).send("Some Error Occured while fetching user info");
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send("Some Error Occured while access token");
        }
    } catch {
        return res.status(500).send("Some Error Occured");
    }
}

const testHandler = async (req: Request, res: Response): Promise<Response> => {
    //log cookie
    // console.log(req);
    return res.status(200).send("Test Successful");
}

export { webSigninHandler, testHandler };