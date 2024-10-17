const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const path = require("path");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user._id;
  const blog = await Blog.create({
    title,
    content,
    createdBy,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:id", async (req, res) => {
  const { content } = req.body;
  const createdBy = req.user._id;
  const blogId = req.params.id;
  console.log(req.params);
  await Comment.create({
    content,
    createdBy,
    blogId,
  });
  return res.redirect(`/blog/${blogId}`);
});

module.exports = router;
