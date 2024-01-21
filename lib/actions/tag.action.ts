import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";

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

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // pagination:
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
