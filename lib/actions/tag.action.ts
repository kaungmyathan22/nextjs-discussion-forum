import User from "@/database/use.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    connectToDatabase();

    const {
      userId,
      // limit = 3
    } = params;
    //
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // // todo: Find interactions for the user and group by tags
    // const tagCountMap = await Interaction.aggregate([
    //   { $match: { user: user._id, tags: { $exists: true, $ne: [] } } },
    //   { $unwind: "$tags" },
    //   { $group: { _id: "$tags", count: { $sum: 1 } } },
    //   { $sort: { count: -1 } },
    //   { $limit: limit },
    // ]);

    // // topTags
    // const topTags = tagCountMap.map((tagCount) => tagCount._id);

    // // todo : find the tag documents for the top tags
    // const topTagDocuments = await Tag.find({ _id: { $in: topTags } });

    // return topTagDocuments;
    return [
      { _id: "tag1", name: "tag1" },
      { _id: "tag2", name: "tag2" },
      { _id: "tag", name: "tag3" },
    ];
  } catch (error) {
    console.error("Error fetching top interacted tags:", error);
    throw error;
  }
};
