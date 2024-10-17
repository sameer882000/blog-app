require("dotenv").config();
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
const dbUri =
  "mongodb+srv://sameer:12345677@cluster0.l3qvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(dbUri);

mongoose.connect(dbUri).then(() => {
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
