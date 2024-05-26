export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
  }

  type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
  }

  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    game(id: ID!): Game
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    deleteGame(id: ID!): [Game]
    addGame(game: addGameInput!): Game
    editGame(id: ID!, edit: editGameInput!): Game
    addAuthor(author: addUserInput!): Author
    editAuthor(id: ID!, edit: editAuthorInput!): Author
    editReview(id: ID!, edit: editReviewInput!): Review
  }

  input addGameInput {
    title: String!
    platform: [String!]!
  }

  input editGameInput {
    title: String
    platform: [String!]
  }

  input addUserInput {
    name: String!
    verified: Boolean!
  }

  input editAuthorInput {
    name: String
    verified: Boolean
  }

  input editReviewInput {
    rating: Int
    content: String
  }
`;
