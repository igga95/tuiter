import "dotenv/config";
import { ApolloServer, AuthenticationError, gql } from "apollo-server";
import "./db.js";
import "./models/user.js";
import "./models/tuit.js";
import "./models/like.js";

import { userTypeDef } from "./typedef/users.js";
import { tuitTypeDef } from "./typedef/tuits.js";
import { likeTypeDef } from "./typedef/likes.js";
import { userResolvers } from "./resolvers/users.js";
import { tuitResolvers } from "./resolvers/tuits.js";
import { mergeResolvers } from "./utils/mergeResolvers.js";
import { context } from "./context/context.js";

// import User from "./models/user.js";
// import Tuit from "./models/tuit.js";

// IMPORTANTE!! -> VER LAS VULNERABILIDADES DE node-fetch QUE VIENE INSTALADO CON APOLLO SERVER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const baseTypeDefs = gql`
    type Query
    type Mutation
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const resolvers = mergeResolvers({}, [userResolvers, tuitResolvers]);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs: [baseTypeDefs, userTypeDef, tuitTypeDef, likeTypeDef],
    resolvers,
    context,
    formatError: (err) => {
        // Don't give the specific errors to the client.
        if (err.message.startsWith("Context creation failed: ")) {
            console.log(err);
            return new AuthenticationError("Authorization failed", { invalidArgs: err.extensions.invalidArgs });
        }
        // Otherwise return the original error. The error can also
        // be manipulated in other ways, as long as it's returned.
        return err;
    },
    debug: true,
});

// The `listen` method launches a web server.
server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
