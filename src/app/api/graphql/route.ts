import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { portfolioTypeDefs } from "@/graphql/schema/portfolio";
import { experienceTypeDefs } from "@/graphql/schema/experience";
import { portfolioResolvers } from "@/graphql/resolvers/portfolio";
import { experienceResolvers } from "@/graphql/resolvers/experience";
import { makeExecutableSchema } from "@graphql-tools/schema";
import connectDB from "@/lib/db";

const schema = makeExecutableSchema({
  typeDefs: [portfolioTypeDefs, experienceTypeDefs],
  resolvers: [portfolioResolvers, experienceResolvers],
});

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    // Ensure database connection before handling any requests
    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection failed:", error);
      // Don't crash the request, let resolvers handle the error
    }
    return {
      req,
    };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
