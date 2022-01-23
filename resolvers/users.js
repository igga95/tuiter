import User from "../models/user.js";
import bcrypt from "bcrypt";
import { UserInputError } from "apollo-server";
import { errFindUserWrap, errSaveWrap } from "../utils/errorWrapper.js";

export const userResolvers = {
    Query: {
        getAllUsers: async () => {
            // Not error handler needed because if there are no documents, .find() will return empty array.
            const users = await User.find({}).populate("tuits").populate("follows").populate("followers");
            return users;
        },
        getUser: async (root, args) => {
            try {
                const user = await User.findById(args.id).populate("tuits");
                return user;
            } catch {
                throw new UserInputError("Field id malform", { invalidArgs: args });
            }
        },
        me: async () => {
            const users = await User.findOne({});
            return users;
        },
    },
    Mutation: {
        createUser: async (root, args) => {
            if (await User.findOne({ username: args.username })) throw new UserInputError("Field username has to be unique");
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(args.password, saltRounds);
            const user = new User({ ...args, passwordHash });

            try {
                return await user.save();
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }
        },
        login: async (root, args) => {
            const { username, password } = args;
            const user = await User.findOne({ username });
            if (user && (await bcrypt.compare(password, user.passwordHash))) return { value: "token" };
            throw new UserInputError("authentication failed", { invalidArgs: args });
        },
        addFollow: async (root, args) => {
            const { username, id } = args;
            const userToFollow = await User.findOne({ username }).populate("followers");
            if (!userToFollow) throw new UserInputError("Field username not valid", { invalidArgs: username });

            const user = await User.findOne({ _id: id }).populate("follows");
            if (!user) throw new UserInputError(`User with id (${id}) not valid`, { invalidArgs: id });

            userToFollow.followers = userToFollow.followers.concat(user);
            user.follows = user.follows.concat(userToFollow);

            try {
                await userToFollow.save();
                await user.save();
            } catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args });
            }

            return user;
        },
    },
};
