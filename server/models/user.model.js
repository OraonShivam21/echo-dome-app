const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async (enteredPassword) => {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async (next) => {
  if (!this.isModified) next();

  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
