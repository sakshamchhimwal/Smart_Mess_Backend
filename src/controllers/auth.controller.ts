import { Request, Response } from 'express';
import { getGoogleOauthTokenWeb, getGoogleOauthTokenAndroid } from '../services/getGoogleOauthToken';
import { getGoogleUser } from '../services/getGoogleUser';
import user_model from '../models/user';
import { createSession } from '../services/createSession';
import { JWTLoadData } from '../Interface/interfaces';
import { sendNotification } from '../config/firebaseWeb';
import Analytics from '../models/analytics';

const webSigninHandler = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { authCode } = req.body;
        console.log(req.body);
        if (!authCode) return res.status(400).send("authCode not provided");
        // Handle web signup
        try {
            const tokeninfo = await getGoogleOauthTokenWeb({ authCode });
            try {
                const userInfo = await getGoogleUser(tokeninfo);
                //check if user already exists
                let user = await user_model.findOne({ Email: userInfo.email });
                let isNewUser = false;
                if (!user) {
                    //create new user
                    const newUser = await user_model.create({
                        Username: userInfo.name,
                        Email: userInfo.email,
                        Phone_Number: 0,
                        Role: "user",
                        First_Name: userInfo.given_name,
                        Last_Name: userInfo.family_name,
                        Image: userInfo.picture,
                        // Eating_Mess: null,
                        Last_Login: Date.now()
                    });
                    user = newUser;
                    isNewUser = true;
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);
        
                const analyticsRecord = await Analytics.findOne({ date: today });
                if (analyticsRecord) {
                    // If record exists for today and the user's ID is not in visitorIds, add it
                    if (!analyticsRecord.visitorIds.includes(user._id.toString())) {
                        analyticsRecord.visitorIds.push(user._id.toString());
                        analyticsRecord.uniqueVisitorsCount += 1;
                        await analyticsRecord.save();
                        console.log("Updated analytics record for today:", analyticsRecord); // Log updated analytics record
                    }
                } else {
                    // If no record exists for today, create a new one
                    const newRecord =   await Analytics.create({
                        date: today,
                        uniqueVisitorsCount: 1,
                        visitorIds: [user._id.toString()]
                    });
                    console.log("Created new analytics record for today:" , newRecord);
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
                const token = createSession(payload);
                if (isNewUser) return res.status(201).json({ token, user });
                return res.status(200).json({ token, user });
                //
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

const androidSigninHandler = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const {Email,Username,Image,First_Name,Last_Name} = req.body;
        console.log(req.body);
        let user = await user_model.findOne({ Email: Email });
        let isNewUser = false;
        if (!user) {
            //create new user
            const newUser = await user_model.create({
                Username: Username,
                Email: Email,
                Phone_Number: 0,
                Role: "user",
                First_Name: First_Name,
                Last_Name: Last_Name,
                Image: Image,
                // Eating_Mess: null,
                Last_Login: Date.now()
            });
            user = newUser;
            isNewUser = true;
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
        const token = createSession(payload);
        if (isNewUser) return res.status(201).json({ token, user });
        return res.status(200).json({ token, user });
    } catch {
        return res.status(500).send("Some Error Occured");
    }
}


export { webSigninHandler,androidSigninHandler };