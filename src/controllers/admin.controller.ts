import menuTable from "../models/menuTable";

require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import { userResult } from "../Interface/interfaces";
import user from "../models/user";
import complaint from "../models/complaint";


const getUser = async (Email:any):Promise<userResult> =>{
    return <userResult>(<unknown>user.findOne({Email: Email}));
}

export const getComplaints = async (req: any, res: Response, next: NextFunction) => {
    let data = req.user;
    try {
        let currUser: userResult = await getUser(data.email);
        if (!currUser) {
            res.status(404).send("User not found");
        } else {
            let userMess = currUser.Eating_Mess;
            let allComplaints = complaint.find({ Mess: userMess });
            res.send(allComplaints).status(200);
        }
    } catch (error) {
        res.status(501).send("Some Error orccured");
        console.log(error);
    }
};

export const getAllUsers = async (req:any, res: Response,next: NextFunction)=>{
    let data = req.user;
    try{
        let currUser: userResult = await  getUser(data.email);
        if (!currUser) {
            res.status(404).send("User not found");
        } else {
            let userMess = currUser.Eating_Mess;
            let allUsers = user.find({Mess: userMess});
            res.send(allUsers);
        }
    }catch (err) {
        res.send("Unexpected Error").status(500);
        console.log(err);
    }
}

export const assignRole = async (req:any, res: Response, next: NextFunction)=>{
    try{
        const userId = req.body.userId;
        const newRole = req.body.newRole;
        const currUser = await user.findOneAndUpdate({_id:userId},{role:newRole},{new:true});
        res.send(currUser).status(200);
    }catch(err){
        res.send("Unexpected Error").status(501);
        console.log(err);
    }
}

