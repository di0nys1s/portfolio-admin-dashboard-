import { Portfolio } from "@/models/Portfolio";
import { GraphQLError } from "graphql";

export const portfolioResolvers = {
  Query: {
    portfolios: async () => {
      try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        return portfolios;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to fetch portfolios");
      }
    },
    portfolio: async (_: unknown, { id }: { id: string }) => {
      try {
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) {
          throw new GraphQLError("Portfolio not found");
        }
        return portfolio;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to fetch portfolio");
      }
    },
  },
  Mutation: {
    createPortfolio: async (_: unknown, { input }: { input: unknown }) => {
      try {
        const portfolio = new Portfolio(input);
        await portfolio.save();
        return portfolio;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to create portfolio");
      }
    },
    updatePortfolio: async (
      _: unknown,
      { id, input }: { id: string; input: unknown }
    ) => {
      try {
        const portfolio = await Portfolio.findByIdAndUpdate(
          id,
          { $set: input as Record<string, unknown> },
          { new: true, runValidators: true }
        );

        if (!portfolio) {
          throw new GraphQLError("Portfolio not found");
        }

        return portfolio;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to update portfolio");
      }
    },
    deletePortfolio: async (_: unknown, { id }: { id: string }) => {
      try {
        const portfolio = await Portfolio.findByIdAndDelete(id);

        if (!portfolio) {
          throw new GraphQLError("Portfolio not found");
        }

        return true;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to delete portfolio");
      }
    },
  },
};
