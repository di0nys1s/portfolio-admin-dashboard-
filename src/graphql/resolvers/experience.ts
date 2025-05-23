import { Experience } from "@/models/Experience";
import { GraphQLError } from "graphql";

export const experienceResolvers = {
  Query: {
    experiences: async () => {
      try {
        const experiences = await Experience.find().sort({ startDate: -1 });
        return experiences;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new GraphQLError("Failed to fetch experiences");
      }
    },
    experience: async (_: unknown, { id }: { id: string }) => {
      try {
        const experience = await Experience.findById(id);
        if (!experience) {
          throw new GraphQLError("Experience not found");
        }
        return experience;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to fetch experience");
      }
    },
  },
  Mutation: {
    createExperience: async (_: unknown, { input }: { input: unknown }) => {
      try {
        const experience = new Experience(input);
        await experience.save();
        return experience;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to create experience");
      }
    },
    updateExperience: async (
      _: unknown,
      { id, input }: { id: string; input: unknown }
    ) => {
      try {
        const experience = await Experience.findByIdAndUpdate(
          id,
          { $set: input as Record<string, unknown> },
          { new: true, runValidators: true }
        );

        if (!experience) {
          throw new GraphQLError("Experience not found");
        }

        return experience;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to update experience");
      }
    },
    deleteExperience: async (_: unknown, { id }: { id: string }) => {
      try {
        const experience = await Experience.findByIdAndDelete(id);

        if (!experience) {
          throw new GraphQLError("Experience not found");
        }

        return true;
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to delete experience");
      }
    },
  },
};
