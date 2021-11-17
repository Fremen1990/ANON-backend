const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
  userById,
  read,
  // update,
  updateUser,
  listUsers,
  photo,
  remove,
} = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  console.log(req.profile);

  res.json({
    user: req.profile,
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.get("/user/photo/:userId", requireSignin, isAuth, photo);
// router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/users", listUsers);

router.put("/user/:userId", requireSignin, isAuth, updateUser);

router.delete(
  "/user/:user_idToDelete/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.param("userId", userById);

module.exports = router;
