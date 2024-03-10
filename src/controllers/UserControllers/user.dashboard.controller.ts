import { type NextFunction, type Response } from 'express'
import UserModel from '../../models/user'
import createHttpError from 'http-errors'
import SuggestionModel from '../../models/suggestions'

export const getAllSuggestions = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email
    })
    if (!currUser) {
      next(createHttpError(403, 'Unauthorized'))
      return
    }
    if (currUser) {
      const currUserMess = currUser.Eating_Mess
      const suggestions = await SuggestionModel.find({
        messId: currUserMess
      })
        .populate('userId', 'Username Image')
        .populate('upvotes downvotes', 'Username')
        .exec()

      if (suggestions.length > 0) {
        return res.send({
          suggestions,
          hasNext: false // Since you're fetching all suggestions at once, there's no next page.
        })
      }
      return res.status(204).send({ suggestions: [], hasNext: false })
    }
  } catch (err) {
    console.log(err)
    next(createHttpError(500, 'Internal Server Error'))
  }
}

export const voteSuggestion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserData = req.user
  try {
    const currUser = await UserModel.findOne({
      Email: loggedInUserData.email
    })
    if (!currUser) {
      next(createHttpError(403, 'Unauthorized'))
      return
    }
    const suggestionId = req.body.suggestionId
    const updateType =
      req.body.upvote === true
        ? {
          $addToSet: { upvotes: currUser._id },
          $pull: { downvotes: currUser._id }
        }
        : {
          $pull: { upvotes: currUser._id },
          $addToSet: { downvotes: currUser._id }
        }
    const newVote = await SuggestionModel.findOneAndUpdate(
      {
        _id: suggestionId
      },
      updateType,
      { new: true }
    )
    if (newVote !== null) {
      return res.send({
        _id: newVote._id,
        message: 'Voted Successfully',
        upvotes: newVote?.upvotes,
        downvotes: newVote?.downvotes
      })
    } else {
      return res.status(400).send({ message: 'Vote not casted' })
    }
  } catch (err) {
    console.log(err)
    next(createHttpError(500, 'Internal Server Error'))
  }
}


