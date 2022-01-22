import User from "../models/user.js";
import bcrypt from "bcrypt";
import { UserInputError } from "apollo-server";

export const userResolvers = {
    Query: {
        getAllUsers: async () => {
            const users = await User.find({}).populate("tuits").populate("follows").populate("followers");
            console.log(users);
            return users;
        },
        getUser: async (root, args) => {
            const { id } = args;
            const user = await User.findById(id).populate("tuits");
            return user;
        },
        me: async () => {
            const users = await User.find({});
            return users[0];
        },
    },
    Mutation: {
        createUser: async (root, args) => {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(args.password, saltRounds);
            const user = new User({ ...args, passwordHash });
            return await user.save();
        },
        login: async (root, args) => {
            const { username, password } = args;
            const user = await User.findOne({ username });
            if (await bcrypt.compare(password, user.passwordHash)) return { value: "token" };
            throw new UserInputError("authentication failed", { invalidArgs: args });
        },
        addFollow: async (root, args) => {
            const userToFollow = await User.findOne({ username: args.username }).populate("followers");
            const user = await User.findById(args.id).populate("follows");
            user.follows = user.follows.concat(userToFollow);
            userToFollow.followers = userToFollow.followers.concat(user);
            await userToFollow.save();
            return await user.save();
        },
    },
};
