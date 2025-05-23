import { gql } from "@apollo/client";

export const experienceTypeDefs = gql`
  type Experience {
    id: ID!
    title: String!
    company: String!
    location: String!
    startDate: String!
    endDate: String
    current: Boolean!
    description: String!
    technologies: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input ExperienceInput {
    title: String!
    company: String!
    location: String!
    startDate: String!
    endDate: String
    current: Boolean!
    description: String!
    technologies: [String!]!
  }

  type Query {
    experiences: [Experience!]!
    experience(id: ID!): Experience
  }

  type Mutation {
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: ID!, input: ExperienceInput!): Experience!
    deleteExperience(id: ID!): Boolean!
  }
`;
