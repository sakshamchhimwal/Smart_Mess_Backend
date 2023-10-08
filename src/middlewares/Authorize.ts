import { Response, NextFunction } from "express";


export const Authorize = () => {
    return (req: any, res: Response, next: NextFunction) => {
        console.log("Authorizing...")
        const role = req.user.role;
        // console.log(role);
        const url_role = req.url.split('/')[1];
        // priority "admin">"manager">"user"="guest"
        try {
            if (role === "admin") {
                next();
            } else if (role === "manager" && url_role !== "admin") {
                next();
            } else if (role === "user" && url_role === "user") {
                next();
            } else if (role === "guest" && url_role === "guest") {
                next();
            } else {
                res.status(401).json({
                    message: "You are not authorized to access this route"
                })
            }
            console.log("Successfully Authorized...")
        } catch (err) {
            res.status(401).json({
                message: "You are not authorized to access this route"
            })
        }
    }
}