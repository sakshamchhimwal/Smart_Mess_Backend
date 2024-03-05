import { NextFunction, Response } from "express";
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import SuggestionsModel from "../../models/suggestions";
import mongoose from "mongoose";

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
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email,
    });
    if (!currUser) {
      return next(createHttpError(403, "Unauthorized"));
    }

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
    } else if (currUser.Role !== "admin" || "secy") {
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

      if (updateSuggestion.modifiedCount > 0) {
        res.status(204).send({});
      } else {
        res.status(404).send({ message: "Suggestion Not Found" });
      }
    } else {
      return next(createHttpError(403, "Unauthorized to perform this action"));
    }
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Internal Server Error"));
  }
};
