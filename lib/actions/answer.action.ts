"use server";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { author, content, path, question } = params;

    const newAnswer = await Answer.create({
      author,
      content,
      question,
    });

    // add the answer to the question answers array
    await Question.findByIdAndUpdate(question, {
      $push: {
        answers: newAnswer._id,
      },
    });

    // ? add interaction

    // await Interaction.create({
    //   user: author,
    //   action: "answer",
    //   question,
    //   tags: questionObject.tags,
    //   answer: newAnswer._id,
    // });

    //  increase author's reputation +10 points for answering a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);

    return newAnswer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
