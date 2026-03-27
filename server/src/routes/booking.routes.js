import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { changeBookingStatus, checkAvailabilityOfCars, createBooking, ownerBookings, userBookings } from "../controllers/booking.controller.js";

const bookingRouter=Router()


bookingRouter.route("/check-availability").post(checkAvailabilityOfCars)
bookingRouter.route("/create").post(verifyJWT,createBooking)
bookingRouter.route("/user-bookings").post(verifyJWT,userBookings)
bookingRouter.route("/owner-bookings").post(verifyJWT,ownerBookings)
bookingRouter.route("/change-status").post(verifyJWT,changeBookingStatus)

export default bookingRouter