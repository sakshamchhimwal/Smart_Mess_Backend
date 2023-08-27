import { Request, Response } from 'express';
import { getGoogleOauthTokenWeb,getGoogleOauthTokenAndroid } from '../services/getGoogleOauthToken';
import jwt from 'jsonwebtoken';

const signupHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const authCode = req.body.authCode;
        if (!authCode) return res.status(400).send("Auth Code not provided");
        const userAgent = req.get('User-Agent');
        if (userAgent === 'AndroidApp') {
            // Handle Android signup
            try{
                const data = await getGoogleOauthTokenAndroid(authCode);
                console.log(data);
                const id_token = data.id_token;
                const decoded = jwt.decode(id_token);
                console.log(decoded);
            }catch(err){
                console.log(err);
                res.status(500).send("Some Error Occured while fetching token");
            }
        } else if (userAgent === 'WebApp') {
            // Handle web signup
            try{
                const data = await getGoogleOauthTokenWeb(authCode);
                console.log(data);
            }catch(err){
                console.log(err);
                res.status(500).send("Some Error Occured while fetching token");
            }
        } else {
            // Handle other scenarios or return an error
        }
        return res.status(200).send("Signup Successful");
    } catch {
        return res.status(500).send("Some Error Occured");
    }
}
const loginHandler = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send("Login Successful");
}

export { signupHandler, loginHandler };