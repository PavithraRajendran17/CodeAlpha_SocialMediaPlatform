const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// --- SPECIFIC ROUTES FIRST (to avoid conflicts) ---

// GET ALL POSTS (Timeline/Feed)
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: req.params.userId });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    
    const allPosts = userPosts.concat(...friendPosts);
    res.status(200).json(allPosts.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER'S ALL POSTS (Profile Grid-kkaga)
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SAVED POSTS
router.get("/saved/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } }).sort({ createdAt: -1 });
    res.status(200).json(savedPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- PARAMETERIZED ROUTES (must come last) ---

// CREATE A POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE A POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE A POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// LIKE/UNLIKE A POST
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD COMMENT TO POST
router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newComment = {
      userId: req.body.userId,
      username: req.body.username,
      text: req.body.text,
      createdAt: new Date()
    };
    await post.updateOne({ $push: { comments: newComment } });
    res.status(200).json("Comment added");
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE COMMENT FROM POST
router.put("/:id/comment/delete", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $pull: { comments: { _id: req.body.commentId } } });
    res.status(200).json("Comment deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// SAVE/UNSAVE POST
router.put("/:id/save", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    
    if (!post.savedBy.includes(req.body.userId)) {
      await post.updateOne({ $push: { savedBy: req.body.userId } });
      await user.updateOne({ $push: { savedPosts: req.params.id } });
      res.status(200).json("Post saved");
    } else {
      await post.updateOne({ $pull: { savedBy: req.body.userId } });
      await user.updateOne({ $pull: { savedPosts: req.params.id } });
      res.status(200).json("Post unsaved");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;