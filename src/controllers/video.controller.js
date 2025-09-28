import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js"
import mongoose from "mongoose"
import { User } from "../models/user.model.js"




const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            throw new ApiError(400, "Title and description are required.")
        }

        const owner = req?.user._id

        // TODO: get video, upload to cloudinary, create video
        const videoLocalPath = req.files?.videoFile?.[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path


        if (!videoLocalPath || !thumbnailLocalPath) {
            throw new ApiError(400, "Video or thumbnail is missing")
        }

        const video = await uploadOnCloudinary(videoLocalPath)
        if (!video.url) {
            throw new ApiError(400, "Error while uploading video on cloudinary")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail on cloudinary")
        }

        const publishedVideo = await Video.create({
            title,
            description,
            videoFile: {
                url: video.url,
                public_id: video.public_id
            },
            thumbnail: {
                url: thumbnail.url,
                public_id: thumbnail.public_id
            },
            duration: video.duration,
            owner
        })

        if (!publishedVideo) {
            throw new ApiError(500, "Failed to upload")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    video,
                    "Video published successfully"
                )
            )
    } catch (error) {
        console.error("Error occured in publishing the video :: ", error)
        return res
            .status(error.statusCode || 500)
            .json(
                new ApiResponse(
                    error.statusCode || 500,
                    {},
                    error.message || "Something went wrong while publishsing the video"
                )
            )
    }

})

//Get all videos of a channel
const getchannelVideos = asyncHandler(async (req, res) => {
    try {
        const { username } = req.params
        if (!username) {
            throw new ApiError(400, "Username missing...")
        }

        const user = User.findOne({ username })
        if (!user) {
            throw new ApiError(404, "No User Found.")
        }

        const findChannelVideos = await Video.aggregate([
            {
                $match: {
                    owner: user._id
                }
            }
        ])

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    findChannelVideos,
                    "Videos fetched successfully!"
                )
            )
    } catch (error) {
        console.error(
            "Error Occurred in Fetching the channel videos :: ",
            error
        )

        return res
            .status(error.statusCode || 500)
            .json(
                new ApiResponse(
                    error.statusCode || 500,
                    {},
                    error.message || "Something went wrong while fetching the videos"
                )
            )
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const updateViewCount = asyncHandler(async (req, res) => {
    try {
        const { video_id } = req.params
        if (!video_id) throw new ApiError(404, "Video not found")

        const videoId = mongoose.Types.ObjectId(video_id)

        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        )
        if (!video) {
            throw new ApiError(404, "Video not found ")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, video, "View count updated"))
    } catch (error) {
        console.error("Error updating view count: ", error)
        return res
            .status(error.statusCode || 500)
            .json(
                new ApiResponse(
                    error.status || 500,
                    {},
                    error.response || "Error updating view count"
                )
            )
    }
})

export {
    publishAVideo,
    updateViewCount
}