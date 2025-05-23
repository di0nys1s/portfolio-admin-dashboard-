export const portfolioTypeDefs = `#graphql
  type Portfolio {
    id: ID!
    title: String!
    description: String!
    imageUrl: String
    projectUrl: String
    githubUrl: String
    technologies: [String!]!
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input PortfolioInput {
    title: String!
    description: String!
    imageUrl: String
    projectUrl: String
    githubUrl: String
    technologies: [String!]!
    featured: Boolean!
  }

  type Query {
    portfolios: [Portfolio!]!
    portfolio(id: ID!): Portfolio
  }

  type Mutation {
    createPortfolio(input: PortfolioInput!): Portfolio!
    updatePortfolio(id: ID!, input: PortfolioInput!): Portfolio!
    deletePortfolio(id: ID!): Boolean!
  }
`;
