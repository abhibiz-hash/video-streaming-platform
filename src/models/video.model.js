import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary link
            required: [true, "Video file link is required"]
        },
        thumbnail: {
            type: String, //cloudinary link
            required: [true, "Thumbnail is required"]
        },
        title: {
            type: String, 
            required: [true, "Title is required"]
        },
        description: {
            type: String, 
            required: [true, "Description is required"]
        },
        duration: {
            type: Number, 
            required: true
        },
        views:{
            type:Number,
            default:0,
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }



    }, { timestamps: true })


videoSchema.plugin(mongooseAggregatePaginate)    //to write aggregate queries

export const Video = mongoose.model("Video", videoSchema)