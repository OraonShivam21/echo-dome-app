const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// create or fetch one on one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) res.status(404).json({ message: "userID not found" });

  let foundChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  foundChat = await User.populate(foundChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (foundChat.length > 0) {
    res.status(200).json(foundChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const allChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({ allChat });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
});

// fetch all chats for a user
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let foundChat = await User.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", -password)
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    foundChat = await User.populate(foundChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json({ foundChat });
  } catch (error) {
    res
      .status(400)
      .json({ error: error || "something went wrong while fetching chats" });
  }
});

// create new group chats
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    res.status(404).json({ message: "Please fill all the fields." });

  let users = JSON.parse(req.body.users);

  if (users.length < 2)
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group." });

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const allGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({ allGroupChat });
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) res.status(404).json({ message: "chat not found" });
  res.status(200).json({ updatedChat });
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) res.status(404).json({ message: "chat not found" });

  res.status(200).json({ removed });
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) res.status(404).json({ message: "chat not found" });

  res.status(200).json({ added });
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
