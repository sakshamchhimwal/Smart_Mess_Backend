import { Request, Response } from 'express';
import notificationToken from '../models/notificationToken';


export const webAddNotificationTokenHandler = async (req: Request, res: Response) => {
    const { notification_token, Email } = req.body;
    if (!notification_token || !Email) return res.status(400).send("Invalid Request");
    try {
        //check if token already exists with email and platform - web if yes then update it else create new
        const token = await notificationToken.findOneAndUpdate({ Email: Email, Platform: "web" }, { Token: notification_token }, { new: true, upsert: true });
        return res.status(200).send(token);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Some Error Occured");
    }
};