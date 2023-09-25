import admin from 'firebase-admin';

const config = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID as string,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY as string,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-y8g9m%40smart-mess-web.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(config as admin.ServiceAccount),
});


export const sendNotification = async (token: string, title: string, body: string) => {
    try {
        console.log("Sending Notification called")
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error(error);
    }
};