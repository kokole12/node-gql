import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";
import { v4 as uuidv4 } from "uuid";

const resolvers = {
  Query: {
    authors: () => db.authors,
    author: (_, args) => {
      const author = db.authors.find((author) => author.id === args.id);
      if (!author) throw new Error(`Author with id ${args.id} not found`);
      return author;
    },
    games: () => db.games,
    game: (_, args) => {
      const game = db.games.find((game) => game.id === args.id);
      if (!game) throw new Error(`Game with id ${args.id} not found`);
      return game;
    },
    reviews: () => db.reviews,
    review: (_, args) => {
      const review = db.reviews.find((review) => review.id === args.id);
      if (!review) throw new Error(`Review with id ${args.id} not found`);
      return review;
    },
  },
  Game: {
    reviews: (parent) => db.reviews.filter((r) => r.game_id === parent.id),
  },
  Author: {
    reviews: (parent) => db.reviews.filter((r) => r.author_id === parent.id),
  },
  Review: {
    author: (parent) => db.authors.find((a) => a.id === parent.author_id),
    game: (parent) => db.games.find((g) => g.id === parent.game_id),
  },
  Mutation: {
    deleteGame: (_, args) => {
      const gameIndex = db.games.findIndex((g) => g.id === args.id);
      if (gameIndex === -1)
        throw new Error(`Game with id ${args.id} not found`);
      db.games.splice(gameIndex, 1);
      return db.games;
    },
    addGame: (_, args) => {
      const game = { ...args.game, id: uuidv4() };
      db.games.push(game);
      return game;
    },
    editGame: (_, args) => {
      const gameIndex = db.games.findIndex((g) => g.id === args.id);
      if (gameIndex === -1)
        throw new Error(`Game with id ${args.id} not found`);
      const updatedGame = { ...db.games[gameIndex], ...args.edit };
      db.games[gameIndex] = updatedGame;
      return updatedGame;
    },
    addAuthor: (_, args) => {
      const author = { ...args.author, id: uuidv4() };
      db.authors.push(author);
      return author;
    },
    editAuthor: (_, args) => {
      const authorIndex = db.authors.findIndex((a) => a.id === args.id);
      if (authorIndex === -1)
        throw new Error(`Author with id ${args.id} not found`);
      const updatedAuthor = { ...db.authors[authorIndex], ...args.edit };
      db.authors[authorIndex] = updatedAuthor;
      return updatedAuthor;
    },
    editReview: (_, args) => {
      const reviewIndex = db.reviews.findIndex((r) => r.id === args.id);
      if (reviewIndex === -1)
        throw new Error(`Review with id ${args.id} not found`);
      const updatedReview = { ...db.reviews[reviewIndex], ...args.edit };
      db.reviews[reviewIndex] = updatedReview;
      return updatedReview;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
