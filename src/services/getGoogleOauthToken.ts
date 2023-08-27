import axios from "axios";
import qs from "qs";
import { GoogleOauthToken } from "../Interface/interfaces"

const GOOGLE_OAUTH_CLIENT_ID_WEB = process.env.GOOGLE_OAUTH_CLIENT_ID_WEB as unknown as string;
const GOOGLE_OAUTH_CLIENT_SECRET_WEB = process.env.GOOGLE_OAUTH_CLIENT_SECRET_WEB as unknown as string;
const GOOGLE_OAUTH_REDIRECT_WEB = process.env.GOOGLE_OAUTH_REDIRECT_WEB as unknown as string;

const GOOGLE_OAUTH_CLIENT_ID_ANDROID = process.env.GOOGLE_OAUTH_CLIENT_ID_ANDROID as unknown as string;
const GOOGLE_OAUTH_CLIENT_SECRET_ANDROID = process.env.GOOGLE_OAUTH_CLIENT_SECRET_ANDROID as unknown as string;
const GOOGLE_OAUTH_REDIRECT_ANDROID = process.env.GOOGLE_OAUTH_REDIRECT_ANDROID as unknown as string;

const getGoogleOauthTokenWeb = async ({
    code,
}: {
    code: string;
}): Promise<GoogleOauthToken> => {
    const rootURl = "https://oauth2.googleapis.com/token";

    const options = {
        code,
        client_id: GOOGLE_OAUTH_CLIENT_ID_WEB,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET_WEB,
        redirect_uri: GOOGLE_OAUTH_REDIRECT_WEB,
        grant_type: "authorization_code",
    };
    try {
        const { data } = await axios.post<GoogleOauthToken>(
            rootURl,
            qs.stringify(options),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return data;
    } catch (err: any) {
        console.log("Failed to fetch Google Oauth Tokens");
        throw new Error(err);
    }
};


const getGoogleOauthTokenAndroid = async ({
    code,
}: {
    code: string;
}): Promise<GoogleOauthToken> => {
    const rootURl = "https://oauth2.googleapis.com/token";

    const options = {
        code,
        client_id: GOOGLE_OAUTH_CLIENT_ID_ANDROID,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET_ANDROID,
        redirect_uri: GOOGLE_OAUTH_REDIRECT_ANDROID,
        grant_type: "authorization_code",
    };
    try {
        const { data } = await axios.post<GoogleOauthToken>(
            rootURl,
            qs.stringify(options),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return data;
    } catch (err: any) {
        console.log("Failed to fetch Google Oauth Tokens");
        throw new Error(err);
    }
};

export { getGoogleOauthTokenWeb, getGoogleOauthTokenAndroid };
