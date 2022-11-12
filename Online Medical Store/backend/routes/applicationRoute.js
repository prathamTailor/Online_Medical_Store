const express = require("express");
const { createCategory } = require("../controllers/applicationController");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router
  .route("/admin/category/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);

module.exports = router;
