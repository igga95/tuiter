import Tuit from "../models/tuit.js";
import User from "../models/user.js";
import { UserInputError, AuthenticationError } from "apollo-server";
import { findErrWrap } from "../utils/errWrapper.js";

export const tuitResolvers = {
    Query: {
        getTuit: async (root, args) => {
            const { id } = args;
            const tuit = await findErrWrap(Tuit.findById(id).populate("user"));
            return tuit;
        },

        getLikes: async (root, args) => {
            const { id } = args;
            const tuit = await findErrWrap(Tuit.findById(id), id);
            // const users = await findErrWrap(User.find({ likedTuits: id }), id);
            const users = await findErrWrap(User.find({ _id: { $in: tuit.likes } }), id);
            return users;
        }, // check

        getQtyLikes: async (root, args) => {
            const { id } = args;
            const tuit = await findErrWrap(Tuit.findById(id));
            return tuit.likes.length;
        },
    },
    Mutation: {
        addTuit: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");

            const newTuit = new Tuit({ ...args, user: user._id });
            user.tuits = user.tuits.concat(newTuit);
            let tuit = null;
            try {
                await Promise.all([user.save(), newTuit.save()]);
                tuit = await Tuit.findOne({ _id: newTuit._id }).populate("user");
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }
            return tuit;
        },

        likeTuit: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");

            const { id: tuitId } = args;
            const tuit = await findErrWrap(Tuit.findOne({ _id: tuitId }).populate("user").populate("likes"));
            if (!tuit) throw new UserInputError("Tuit does not exist", { invalidArgs: args });

            user.likedTuits = user.likedTuits.concat(tuit);
            tuit.likes = tuit.likes.concat(user);
            try {
                await Promise.all([user.save(), tuit.save()]);
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }
            return tuit;
        },
    },
};
