const express = require("express");
const ejs = require("ejs");
const path = require("path");
const PORT = process.env.PORT || 3000;
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middleware/authentication");
const Blog = require("./models/blog");

mongoose.connect("mongodb://localhost:27017/blogy").then(() => {
  console.log("Connected to MongoDB");
});


const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication("token"));
app.use(express.static(path.resolve("./public")));


app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  console.log(blogs);
  res.render("home", { user: req.user, blogs });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
