import { gql } from "apollo-server";

export const tuitTypeDef = gql`
    type Tuit {
        id: ID!
        content: String!
        user: User!
        likes: [User]!
    }

    extend type Query {
        getTuit(id: ID!): Tuit
        getQtyLikes(id: ID!): Int!
        getLikes(id: ID!): [User]
    }

    extend type Mutation {
        addTuit(content: String!): Tuit
        # removeTuit(id: ID!): Tuit
        likeTuit(id: ID!): Tuit
        # unlikeTuit(id: ID!): Tuit
    }
`;
