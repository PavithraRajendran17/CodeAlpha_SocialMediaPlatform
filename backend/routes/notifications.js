const router = require("express").Router();
const Notification = require("../models/Notification");

// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  const newNotification = new Notification(req.body);
  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER NOTIFICATIONS
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// MARK NOTIFICATION AS READ
router.put("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json("Notification marked as read");
  } catch (err) {
    res.status(500).json(err);
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.put("/readall/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { read: true }
    );
    res.status(200).json("All notifications marked as read");
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE NOTIFICATION
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json("Notification deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;