const http = require("http");
const headers = require("./headers");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Post = require("./models/post");
const { errorHandle, successHandle } = require("./handler");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
// 連接資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

let posts = [];

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  if (req.url === "/posts" && req.method === "GET") {
    posts = await Post.find();
    successHandle(res, posts);
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const post = JSON.parse(body);
        if (post !== undefined) {
          await Post.create(post);
          posts = await Post.find();
          successHandle(res, posts);
        } else {
          errorHandle(res, 4003);
        }
      } catch (error) {
        errorHandle(res, error.message);
      }
    });
  } else if (req.url === "/posts" && req.method === "DELETE") {
    await Post.deleteMany({});
    successHandle(res, []);
  } else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    try {
      const id = req.url.split("/").pop();
      await Post.findByIdAndDelete(id);
      posts = await Post.find();
      successHandle(res, posts);
    } catch (error) {
      errorHandle(res, error.message);
    }
  } else if (req.url.startsWith("/posts/") && req.method === "PATCH") {
    req.on("end", async () => {
      try {
        const id = req.url.split("/").pop();
        const post = JSON.parse(body);
        await Post.findByIdAndUpdate(id, post);
        posts = await Post.find();
        successHandle(res, posts);
      } catch (error) {
        errorHandle(res, error.message);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandle(res, 4001);
  }
};

const sever = http.createServer(requestListener);

const PORT = 3000;

sever.listen(process.env.PORT || PORT, () => {
  console.log("Sever is listening on port", PORT);
});
