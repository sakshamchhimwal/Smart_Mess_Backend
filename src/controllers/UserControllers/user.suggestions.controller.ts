import { NextFunction, Response } from "express";
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import SuggestionsModel from "../../models/suggestions";
import mongoose from "mongoose";
import { sendNotification } from "../../config/firebaseWeb";
import notificationToken from "../../models/notificationToken";
import usernotifications from "../../models/usernotifications";
import e from "cors";

export const getSuggestions = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }
    if (currUser) {
      const messId = currUser.Eating_Mess;
      const currPage = req.query.page;
      const LIMIT = 10;
      const paginatedSuggestions = await SuggestionsModel.find({
        messId: messId,
        userId: currUser._id,
      })
        .skip((currPage - 1) * LIMIT)
        .limit(LIMIT)
        .sort({ createdAt: -1 })
        .populate("userId", "Username Image")
        .populate("upvotes downvotes", "Username")
        .exec();

      if (paginatedSuggestions.length > 0) {
        return res.status(200).send({
          suggestions: paginatedSuggestions,
          hasNext: paginatedSuggestions.length === LIMIT,
        });
      }
      return res.status(204).send({ suggestions: [], hasNext: false });
    }
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

export const postSuggestion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }
    const messId = currUser.Eating_Mess;
    const newSuggestion = req.body;
    console.log(req.body);
    const addSuggestion = await SuggestionsModel.create({
      messId,
      userId: currUser._id,
      ...newSuggestion,
      createdAt: Date.now(),
    });
    if (addSuggestion) {
      return res.status(200).send({ Message: "Suggestion added successfully" });
    } else {
      return res.status(400).send({ Message: "Failure suggestion not added" });
    }
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

export const patchSuggestion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.body.suggestionId;
    const newSuggestion = req.body.suggestion;

    const updateSuggestion = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
        userId: currUser._id,
      },
      {
        $set: {
          suggestion: newSuggestion,
        },
      }
    );

    if (updateSuggestion.modifiedCount > 0) {
      res.status(204).send({});
    } else {
      res.status(404).send({ message: "Suggestion Not Found" });
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const deleteSuggestion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.query.suggestionId;
    const deletedSuggestion = await SuggestionsModel.findOneAndDelete({
      _id: suggestionId,
      userId: currUser._id,
    });

    if (deletedSuggestion) {
      // console.log(deletedSuggestion);
      res
        .status(200)
        .send({ message: "Sugestion deleted successfully", deletedSuggestion });
    } else {
      res.status(404).send({ message: "Suggestion Not Found" });
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const postSuggestionComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.body.suggestionId;
    const newComment = req.body.comment;
    const newCommentId = new mongoose.Types.ObjectId();

    const updateSuggestion = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
      },
      {
        $push: {
          children: {
            userId: currUser._id,
            id: newCommentId,
            comment: newComment,
          },
        },
      }
    );

    if (updateSuggestion.modifiedCount > 0) {
      res.status(204).send({});
    } else {
      res.status(404).send({ message: "Suggestion Not Found" });
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const patchSuggestionComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.body.suggestionId;
    const commentId = req.body.commentId;
    const newComment = req.body.comment;

    const updateSuggestion = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
        "children.id": commentId,
      },
      {
        $set: {
          "children.$.comment": newComment,
        },
      }
    );

    if (updateSuggestion.modifiedCount > 0) {
      res.status(204).send({});
    } else {
      res.status(404).send({ message: "Suggestion Not Found" });
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const deleteSuggestionComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;

  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.body.suggestionId;
    const commentId = req.body.commentId;
    console.log(suggestionId, commentId);
    const updateSuggestion = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
      },
      {
        $pull: {
          children: {
            id: commentId,
          },
        },
      }
    );

    if (updateSuggestion.modifiedCount > 0) {
      res.status(204).send({});
    } else {
      res.status(404).send({ message: "Suggestion Not Found" });
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const voteSuggestionComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      next(createHttpError(403, "Unauthorized"));
      return;
    }
    const suggestionId = req.body.suggestionId;
    const commentId = req.body.commentId;
    const updateType =
      req.body.upvote === true
        ? {
            $addToSet: { "children.$.upvotes": currUser._id },
            $pull: { "children.$.downvotes": currUser._id },
          }
        : {
            $pull: { "children.$.upvotes": currUser._id },
            $addToSet: { "children.$.downvotes": currUser._id },
          };
    const newVote = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
        "children.id": commentId,
      },
      updateType
    );
    if (newVote.modifiedCount > 0) {
      return res.send({ message: "Voted Successfully" });
    } else {
      return res.status(400).send({ message: "Vote not casted" });
    }
  } catch (err) {
    console.log(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const markAsClosed = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    // Find the current user based on email
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const suggestionId = req.body.suggestionId;

    // Update the suggestion to mark it as closed if it belongs to the current user
    const updateSuggestion = await SuggestionsModel.updateOne(
      {
        _id: suggestionId,
      },
      {
        $set: {
          status: "closed",
        },
      }
    );

    if (updateSuggestion.modifiedCount <= 0) {
      return res.status(404).send({ message: "Suggestion Not Found" });
    }

    const title = "Issue Closed";
    const body = `Issue has been closed by ${currUser.Username}`;

    // Array to store notification tokens
    const tokens: string[] = [];

    // Get notification token for the current user
    const userToken = await notificationToken.findOne({ userId: currUser._id });
    if (userToken) {
      tokens.push(userToken.Token);
    }

    // Get notification tokens for secretaries, admins, and mess managers
    const users = await UserModel.find({
      $or: [{ Role: "admin" }, { Role: "secy" }, { Role: "manager" }],
    });

    await usernotifications.create({
      Title: title,
      Message: body,
      sendTo: users.map((user) => user._id),
      Date: Date.now(),
      readBy: [],
    });

    for (const user of users) {
      const userToken = await notificationToken.findOne({ Email: user.Email });
      if (userToken) {
        tokens.push(userToken.Token);
      }
    }
    console.log("tokens:", tokens);
    // Remove any empty tokens
    const tokenList = tokens.filter((token) => !!token);

    // Send notifications to all tokens
    for (var i = 0; i < tokenList.length; i++) {
      try {
        await sendNotification(tokenList[i], title, body);
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    }

    // Return success response
    return res.status(204).send({});
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

export const getOneSuggestion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }
    const suggestionId = req.query.suggestionId;
    const suggestion = await SuggestionsModel.findOne({
      _id: suggestionId,
    })
      .populate("userId", "Username Image")
      .populate({
        path: "children",
        populate: { path: "userId", select: "Username Image" },
      })
      .exec();
    if (suggestion) {
      return res.status(200).send({ suggestion });
    } else {
      return res.status(204).send({ suggestion: null });
    }
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

export const markAsClosedAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user;
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });

    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    } else if (currUser.Role !== "admin" && currUser.Role !== "secy") {
      // Corrected condition
      const suggestionId = req.body.suggestionId;

      const updateSuggestion = await SuggestionsModel.updateOne(
        {
          _id: suggestionId,
          userId: currUser._id,
        },
        {
          $set: {
            status: "closed",
          },
        }
      );

      const suggestion = await SuggestionsModel.findOne({ _id: suggestionId });

      if (!suggestion) {
        return res.status(404).send({ message: "Suggestion Not Found" });
      }

      const user = await UserModel.findOne({ _id: suggestion.userId });

      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }

      const title = "Issue Closed by Admin";
      const body = `Issue has been closed by ${currUser.Username}`;

      await usernotifications.create({
        Title: title,
        Message: body,
        sendTo: user._id,
        Date: Date.now(),
        readBy: [],
      });

      const token = await notificationToken.findOne({ Email: user.Email });
      if (!token) {
        return res
          .status(404)
          .send({ message: "Notification Token Not Found" });
      }

      await sendNotification(token.Token, title, body);

      res.status(204).send({});
    } else {
      return next(createHttpError(403, "Unauthorized to perform this action"));
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};
