const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ msg: "Username is required" });
  }

  // You can later connect this to MongoDB
  return res.status(200).json({ user: { username } });
});

module.exports = router;
