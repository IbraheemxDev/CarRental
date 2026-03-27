import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeRoleToOwner,
  addCar,
  ownerCars,
  toggleCarAvailability,
  deleteCar,
  getOwnerDashboardData,
  updateProfileImage    
} from "../controllers/owner.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const ownerRouter = Router();
ownerRouter.use(verifyJWT);
ownerRouter.route("/change-role").post(changeRoleToOwner);
ownerRouter.route("/add-car").post(upload.single("image"), addCar);
ownerRouter.route("/cars").get(ownerCars);
ownerRouter.route("/toggle-car").post(toggleCarAvailability);
ownerRouter.route("/delete-car").post(deleteCar);
ownerRouter.route("/dashboard").get(getOwnerDashboardData);
ownerRouter.route("/update-profile-image").post(upload.single("image"), updateProfileImage);

export default ownerRouter;