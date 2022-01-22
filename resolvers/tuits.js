import Tuit from "../models/tuit.js";
import User from "../models/user.js";

export const tuitResolvers = {
    Query: {
        getTuit: async (root, args) => {
            const { id } = args;
            const tuit = await Tuit.findById(id).populate("user");
            return tuit;
        },
    },
    Mutation: {
        addTuit: async (root, args) => {
            // lo que sigue cambia con jwt
            const user = await User.findOne({ username: "gabriel" });
            const newTuit = new Tuit({ ...args, user });
            user.tuits = user.tuits.concat(newTuit);
            await user.save();
            return await newTuit.save();
        },
    },
};
