import axios from "axios";
import { GoogleUserResult } from "../Interface/interfaces";

export async function getGoogleUser({
    id_token,
    access_token,
}: {
    id_token: string;
    access_token: string;
}): Promise<GoogleUserResult> {
    try {
        const { data } = await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );

        return data;
    } catch (err: any) {
        console.log(err);
        throw Error(err);
    }
}
