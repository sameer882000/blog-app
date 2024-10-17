const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/images`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("signin", { error: err.message });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup",upload.single("profileImage"),  async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password, profileImageURL: `/images/${req.file.filename}` });
  return res.redirect("/user/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
