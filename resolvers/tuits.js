import Tuit from "../models/tuit.js";
import User from "../models/user.js";
import Like from "../models/like.js";
import { UserInputError, AuthenticationError } from "apollo-server";

export const tuitResolvers = {
    Query: {
        getTuit: async (root, args) => {
            const { id } = args;
            const tuit = await Tuit.findById(id).populate("user");
            return tuit;
        },
    },
    Mutation: {
        addTuit: async (root, args, context) => {
            const { user } = context;
            console.log(user);
            if (!user) throw new AuthenticationError("Not logged in");

            const newTuit = new Tuit({ ...args, user: user._id });
            user.tuits = user.tuits.concat(newTuit);
            let tuit = null;
            try {
                await user.save();
                await newTuit.save();
                tuit = Tuit.findOne({ _id: newTuit._id }).populate("user");
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }
            return tuit;
        },

        likeTuit: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");

            const { id: tuitId } = args;
            const tuit = await Tuit.findOne({ _id: tuitId }).populate("user").populate("likes");
            if (!tuit) throw new UserInputError("Tuit does not exist", { invalidArgs: args });

            const like = new Like({ user: user._id, tuit: tuit._id });

            user.likes = user.likes.concat(like);
            tuit.likes = tuit.likes.concat(like);
            try {
                await like.save();
                await user.save();
                await tuit.save();
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }
            return tuit;
        },
    },
};
