import User from "../models/user.js";
import Tuit from "../models/tuit.js";
import bcrypt from "bcrypt";
import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { PossibleFragmentSpreadsRule } from "graphql";

const findOneUserAndCheck = async (username) => {
    const user = await User.findOne({ username });
    if (!user) UserInputError("User does not exist", { invalidArgs: args });
    return user;
};

export const userResolvers = {
    Query: {
        getAllUsers: async () => {
            // Not error handler needed because if there are no documents, .find() will return empty array.
            const users = await User.find({}).populate("tuits").populate("follows").populate("followers").populate("likedTuits");
            return users;
        },

        getUser: async (root, args) => {
            const user = await User.findOne({ username: args.username }).populate("tuits").populate("follows").populate("followers").populate("likedTuits");
            return user;
        },

        me: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");
            return user;
        },

        getQtyTuits: async (root, args) => {
            const user = await findOneUserAndCheck(args.username);
            return user.tuits.length;
        },

        getFollows: async (root, args) => {
            const user = await User.findOne({ username: args.username }).populate("follows");
            if (!user) UserInputError("User does not exist", { invalidArgs: args });
            return user.follows;
        },

        getQtyFollows: async (root, args) => {
            const user = await findOneUserAndCheck(args.username);
            return user.follows.length;
        },

        getFollowers: async (root, args) => {
            const user = await User.findOne({ username: args.username }).populate("followers");
            if (!user) UserInputError("User does not exist", { invalidArgs: args });
            return user.followers;
        },

        getQtyFollowers: async (root, args) => {
            const user = await findOneUserAndCheck(args.username);
            return user.followers.length;
        },

        getLikedTuits: async (root, args) => {
            const user = await findOneUserAndCheck(args.username);
            // const user = await User.findOne({ username: args.username }).populate("likedTuits").populate("user");
            console.log(user.likedTuits);
            const tuits = await Tuit.find({ _id: { $in: user.likedTuits } }).populate("user");
            console.log(tuits);
            return tuits;
        }, // this has to be re-done
    },

    Mutation: {
        createUser: async (root, args) => {
            if (await User.findOne({ username: args.username })) throw new UserInputError("Field username has to be unique", { invalidArgs: args });

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
            if (user && (await bcrypt.compare(password, user.passwordHash))) {
                const userForToken = {
                    id: user._id,
                    username: user.username,
                };
                return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
            }
            throw new AuthenticationError("Authentication failed", { invalidArgs: args });
        },

        followUser: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");
            const { username: usernameToFollow } = args;

            const userToFollow = await User.findOne({ username: usernameToFollow }).populate("followers");
            if (!userToFollow) throw new UserInputError("Field username not valid", { invalidArgs: args });

            if (!user.follows.find((el) => el.username === userToFollow.username)) {
                userToFollow.followers = userToFollow.followers.concat(user);
                user.follows = user.follows.concat(userToFollow);

                try {
                    await Promise.all([userToFollow.save(), user.save()]);
                } catch (err) {
                    throw new UserInputError(err.message, { invalidArgs: args });
                }
            }

            return user;
        },

        unfollowUser: async (root, args, context) => {
            const { user } = context;
            if (!user) throw new AuthenticationError("Not logged in");

            const { username: usernameToUnfollow } = args;
            const userToUnfollow = await User.findOne({ username: usernameToUnfollow }).populate("followers");
            if (!userToUnfollow) throw new UserInputError("Field username not valid", { invalidArgs: args });

            const indexToUnfollow = user.follows.findIndex((el) => el.username === userToUnfollow.username);
            if (indexToUnfollow !== -1) {
                user.follows.splice(indexToUnfollow, 1);
                const indexUnfollower = userToUnfollow.followers.findIndex((el) => el.username === user.username);
                userToUnfollow.followers.splice(indexUnfollower, 1);

                try {
                    await Promise.all([userToUnfollow.save(), user.save()]);
                } catch (err) {
                    throw new UserInputError(err.message, { invalidArgs: args });
                }
            }

            return user;
        },
    },
};
