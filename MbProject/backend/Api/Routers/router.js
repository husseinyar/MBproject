
const express = require("express")
const  router = express.Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndSuperAdmin
  } = require("../middleware/verifyToken");
const  {login, register , Logut} = require( "../Controllers/auth"); 
const {
    getStatus,
    getAllUsers,
    getbyId,
    deleteUser,
    updatedUser
  } =require("../Controllers/User");

  const {
    createProject ,
    getAllProjects,
    getProjectsStatus,
    getProjectbyId,
    deleteProjects,
    updatedProject
  } =require("../Controllers/Projects");

/* user regisering and Login*/
router.post("/auth/register", register);
router.post("/auth/login", login);
router.delete("/auth/Logut", Logut);



/* */

/* user uppdatning*/

router.get("/users", verifyTokenAndAdmin, getAllUsers);
router.get("/user/stats", verifyTokenAndAdmin,  getStatus);
router.get("/user/find/:id", verifyTokenAndAdmin, getbyId);
router.get("/user/:id", verifyTokenAndAuthorization, deleteUser);
router.put("/user/:id",verifyTokenAndAuthorization, updatedUser);



router.post("/Project/create", verifyTokenAndAdmin, createProject);
router.get("/Project", verifyTokenAndAdmin,  getAllProjects);
router.get("/Project/stats", verifyTokenAndAdmin,  getProjectsStatus);
router.get("/Project/find/:id", verifyTokenAndAdmin, getProjectbyId);
router.delete("/Project/:id", verifyTokenAndAuthorization, deleteProjects);
router.put("/Project/:id",verifyTokenAndAuthorization, updatedProject);
module.exports = router;