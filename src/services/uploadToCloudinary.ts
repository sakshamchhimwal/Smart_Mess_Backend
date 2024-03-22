import { config } from "dotenv";
config();
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary.api
// 	.ping()
// 	.then((res) => {
// 		res.status === "ok"
// 			? console.log("Connected to Cloudinary")
// 			: console.warn("Cloudinary connection failed");
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

export const uploadToCloudinary = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// console.log(req.body);
		// console.log(req.file);
		if (req.file) {
			const uploadedImage = await cloudinary.uploader.upload(
				`./tmp/uploads/users/${req.file?.filename}`,
				{
					folder: "Smart_Mess/User_Uploads",
				}
			);
			req.body.image = uploadedImage.secure_url;
		}
		next();
	} catch (err) {
		const mute = err;
		console.log({ cloudinaryError: err });
		console.error("Error Occured in Cloudinary Upload");
		return next(createHttpError(500));
	}
};


export const deleteFromCloudinary = async (publicID: string) => {
	cloudinary.uploader.destroy(publicID).then(() => {
		return 1;
	}).catch((err) => {
		console.log(err);
		throw Error("cloudinary delete error");
	})
}
