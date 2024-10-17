const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/profile.png",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.salt = salt; // Store the salt
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash; // Store the hashed password

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
    const salt = user.salt;
    const hashedpassword = user.password;
    const userProvidedHash = await bcrypt.hash(password, salt);
    if (userProvidedHash !== hashedpassword)
      throw new Error("Invalid password!");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
