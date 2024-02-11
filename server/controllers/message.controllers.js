const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

// get all messages
const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json({ messages });
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

// create new messages
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId)
    res.status(404).json({ error: "invalid data passed into request" });

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

module.exports = {
  allMessage,
  sendMessage,
};
