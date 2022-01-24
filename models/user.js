import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 4,
    },
    name: {
        type: String,
        required: true,
        minlength: 4,
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 4,
    },
    tuits: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tuit",
        },
    ],
    follows: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
});

export default mongoose.model("User", userSchema);
