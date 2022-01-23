import { UserInputError } from "apollo-server";

export const errFindUserWrap = (func, args, msg = "") => {
    return (f) => {
        func.catch((err) => {
            msg = msg || err.message;
            throw new UserInputError(msg, { invalidArgs: args });
        });
    };
};

export const errSaveWrap = (func, args) => {
    return func.catch((err) => {
        throw new UserInputError(err.message, { invalidArgs: args });
    });
};
