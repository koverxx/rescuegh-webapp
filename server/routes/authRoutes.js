const express = require("express");
const router = express.Router();

// Temporary test route
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  res.json({ message: "User signup route working ✅", email, password });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.json({ message: "User login route working ✅", email, password });
});

module.exports = router;
