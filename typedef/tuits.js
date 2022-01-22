import { gql } from "apollo-server";

export const tuitTypeDef = gql`
    type Tuit {
        id: ID!
        content: String!
        user: User
    }

    extend type Query {
        getTuit(id: ID!): Tuit
    }

    extend type Mutation {
        addTuit(content: String!): Tuit
    }
`;
