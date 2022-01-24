import { gql } from "apollo-server";

export const userTypeDef = gql`
    type User {
        id: ID!
        username: String!
        name: String!
        tuits: [Tuit]!
        follows: [User]!
        followers: [User]!
        likes: [Like]!
    }

    type Token {
        value: String!
    }

    extend type Query {
        getAllUsers: [User]
        getUser(id: ID!): User
        me: User!
    }

    extend type Mutation {
        createUser(username: String!, name: String!, password: String!): User
        login(username: String!, password: String!): Token
        followUser(username: String!): User
        unfollowUser(username: String!): User
    }
`;
