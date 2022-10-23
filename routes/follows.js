const express = require("express");
const router = express.Router();
const followsController = require("../controllers/follows");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/followUser/:receiver", followsController.followUser);
router.delete("/unfollowUser/:receiver", followsController.unfollowUser);

module.exports = router;
