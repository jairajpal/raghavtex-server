import { Router } from "express";
import { registerUser, signInUser } from "../controller/user.controller";
import {
  createCompany,
  createUserChallan,
  editCompany,
  editUserChallan,
  getCompany,
  getDropDown,
  getDropDownFilter,
  getUserChallansByUserId,
} from "../controller/challan.controller";
const router = Router();
const { authenticate } = require("../middleware/authenticate");

router.route("/add-user").post(registerUser);
router.route("/login-user/:login_by").post(signInUser);
router.route("/get-challan").get(authenticate, getUserChallansByUserId);
router.route("/add-challan").post(authenticate, createUserChallan);
router.route("/edit-challan").post(authenticate, editUserChallan);
router.route("/get-company").get(authenticate, getCompany);
router.route("/add-company").post(authenticate, createCompany);
router.route("/edit-company").post(authenticate, editCompany);
router.route("/get-dropdown").get(authenticate, getDropDown);
router.route("/get-dropdownfilter").get(authenticate, getDropDownFilter);

export default router;
