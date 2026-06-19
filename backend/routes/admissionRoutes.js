const express = require("express");

const router = express.Router();

const {

  createAdmission,
  getAdmissions,
  getMyAdmission,
  deleteAdmission,
  updateAdmission

} = require(
  "../controllers/admissionController"
);

const {

  protect,
  adminOnly

} = require(
  "../middleware/authMiddleware"
);

/* Public Route */

router.post(
  "/",
  createAdmission
);

/* Admin Routes */

/* Get All Admissions */

router.get(
  "/me",
  protect,
  getMyAdmission
);

router.get(
  "/",
  protect,
  adminOnly,
  getAdmissions
);

/* Delete Student */

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteAdmission
);

/* Update Student */

router.put(
  "/:id",
  protect,
  adminOnly,
  updateAdmission
);

module.exports = router;
