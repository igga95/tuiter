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
    likedTuits: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tuit",
        },
    ],
});

export default mongoose.model("User", userSchema);
