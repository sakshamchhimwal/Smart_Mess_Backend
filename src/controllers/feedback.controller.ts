import { Request, Response } from 'express';
import feedback from '../models/actualFeedback';

export const getAllfeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await feedback.find();
        return res.status(200).json(feedbacks);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Some Error Occured");
    }
};


