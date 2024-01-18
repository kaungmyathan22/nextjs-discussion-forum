"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

export const createQuestion = async (params: any) => {
  // eslint-disable-next-line no-empty
  try {
    // connect to DATABASE
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    // // create a new question
    const question = await Question.create({
      title,
      content,
      author,
    });

    // // tag documents array
    const tagDocuments = [];

    // create tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // // todo: create a interaction record for the user's ask question action

    // await Interaction.create({
    //   user: author,
    //   question: question._id,
    //   action: "ask-question",
    //   tags: tagDocuments,
    // });

    // // todo: increament author reputation by +5 points for creating a question

    // await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
