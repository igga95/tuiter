import { gql } from "apollo-server";

export const tuitTypeDef = gql`
    type Tuit {
        id: ID!
        content: String!
        user: User!
        likes: [Like]!
    }

    extend type Query {
        getTuit(id: ID!): Tuit
    }

    extend type Mutation {
        addTuit(content: String!): Tuit
        likeTuit(id: ID!): Tuit
    }
`;
