import { Request, Response } from 'express';
import notificationToken from '../models/notificationToken';
import notification from '../models/notifications';
import User from '../models/user';
import { CustomRequest } from '../Interface/interfaces';
import user from '../models/user';
import notifications from '../models/notifications';
import mongoose from 'mongoose';


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

export const getAllNotifications = async (req: CustomRequest | Request, res: Response) => {
    try {
        //if user in req then extact email from user
        const email = ('user' in req) ? req.user.email : null;
        const user: any = await User.findOne({ Email: email });
        if (!user) console.log(user._id)
        const notifications = await notification.find();
        let response: any = [];
        notifications.forEach((notification) => {
            //push notification to response only with field read: true if user has read the notification and false otherwise
            if (notification.readBy.includes(user._id)) {
                response.push({
                    _id: notification._id,
                    Title: notification.Title,
                    Message: notification.Message,
                    Date: notification.Date,
                    read: true
                })
            }
            else {
                response.push({
                    _id: notification._id,
                    Title: notification.Title,
                    Message: notification.Message,
                    Date: notification.Date,
                    read: false
                })
            }
        })
        //jsonify response
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Some Error Occured");
    }
};

export const makeRead = async (req: any, res: Response) => {
    try {
        // const email = ('user' in req) ? req.user.email : null;
        const email = req.body.email;
        const currUser: any = await user.findOne({ Email: email });
        if (!currUser) { console.log(currUser); }
        const notifId = req.body.notifId;
        const notif = await notifications.findOne({ _id: notifId });
        if (notif) {
            console.log(notif._id);
            await notification.findByIdAndUpdate(notif._id, { $addToSet: { readBy: [new mongoose.Types.ObjectId(currUser._id)] } });
            return res.send("Read").status(200);
        } else {
            return res.send("Unexpected Error").status(404);
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send("Some error occured");
    }
}