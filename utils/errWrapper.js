import { UserInputError } from "apollo-server";

export const findErrWrap = async (f, args) => {
    return f.catch((err) => {
        throw new UserInputError("Id malform", { invalidArgs: args });
    });
};
