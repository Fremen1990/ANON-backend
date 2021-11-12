const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { create } = require("../controllers/articleEntry");

router.post("/article-entry/create/:userId", requireSignin, isAuth, create);

router.param("userId", userById);

module.exports = router;
