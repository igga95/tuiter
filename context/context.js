import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { AuthenticationError } from "apollo-server";

const JWT_SECRET = process.env.JWT_SECRET;

export const context = async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.substring(7);
        let currentUser = null;
        try {
            currentUser = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            throw new AuthenticationError("Authorization failed", { invalidArgs: token });
        }
        return { currentUser };
        // const currentUser = User.findOne({ _id: id });
        // return { id };
        // const currentUser = User.findOne({ _id: dataDecoded.id }).populate("tuits").populate("follows").populate("followers").populate("likes");
    }
};
