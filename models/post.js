const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入貼文標題"],
    },
    tags: {
      type: Array,
      required: [true, "請輸入標籤。例如:['謎因','遊記']"],
    },
    image: {
      type: String,
      required: [true, "請輸入圖片路徑"],
    },
    content: {
      type: String,
      required: [true, "請輸入貼文內容"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "group",
    },
  },
  {
    versionKey: false,
    collection: "posts",
  }
);

const Post = mongoose.model("", postSchema);

module.exports = Post;
