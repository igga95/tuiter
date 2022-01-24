import mongoose from "mongoose";
const { Schema } = mongoose;

const tuitSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 140,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
});

export default mongoose.model("Tuit", tuitSchema);
