import { gql } from "apollo-server";

export const userTypeDef = gql`
    type User {
        id: ID!
        username: String!
        name: String!
        tuits: [Tuit]!
        follows: [User]!
        followers: [User]!
        likedTuits: [Tuit]!
    }

    type Token {
        value: String!
    }

    extend type Query {
        getAllUsers: [User]
        getUser(username: String!): User
        me: User!
        getQtyTuits(username: String!): Int!
        getFollows(username: String!): [User]
        getQtyFollows(username: String!): Int!
        getFollowers(username: String!): [User]
        getQtyFollowers(username: String!): Int!
        getLikedTuits(username: String!): [Tuit]
    }

    extend type Mutation {
        createUser(username: String!, name: String!, password: String!): User
        login(username: String!, password: String!): Token
        followUser(username: String!): User
        unfollowUser(username: String!): User
    }
`;
