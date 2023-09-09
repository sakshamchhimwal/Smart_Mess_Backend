
import { GoogleUserResult } from "../Interface/interfaces";
import { OAuth2Client } from "google-auth-library";


export async function getGoogleUser({ access_token, id_token }: { access_token: string, id_token: string }): Promise<GoogleUserResult | any> {
    try {
        const client = new OAuth2Client({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID_WEB as string,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_WEB as string,
            redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_WEB as string,
        });
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID_WEB as string,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (err: any) {
        console.error("Failed to fetch Google User", err);
        throw err; // Optionally, you can choose to rethrow the original error.
    }
}