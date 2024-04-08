import express from "express"
import {
  registerUser,
  loginUser,
  verifyEmailByUrl,
  findAllUsers,
  updateUser
//   findUser,
//   getUsers,
}from "../Controllers/userController.js";

import {
year,
months
}from "../Controllers/categoryController.js";

const router = express.Router();
router.post("/createUserAndProject", registerUser);
router.post("/login", loginUser);

router.post("/findAllUsers", findAllUsers);
router.post("/updateUser", updateUser);

// router.get("/find/:userId", findUser);
// router.get("/", getUsers);
router.get("/verify-email", verifyEmailByUrl);

router.get('/projects/:year',year);
router.get('/projects/:year/:month', months);
export default  router;