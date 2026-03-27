import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Car } from "../models/car.model.js";
import { Booking } from "../models/booking.model.js";

// change role
const changeRoleToOwner = asyncHandler(async (req, res) => {
  // Implementation for changing user role to owner
  const { _id } = req.user;

  // Assuming you have a User model and a method to find and update the user
  const user = await User.findByIdAndUpdate(
    _id,
    { role: "owner" },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "User role updated to owner.", user));
});

// list a car

const addCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  let car = JSON.parse(req.body.carData);

  const imageLocalPath = req.file?.path;

  let imageData = {
    public_id: "",
    url: "",
  };

  if (!imageLocalPath) {
    return res.status(400).json( new ApiResponse(400, "Image is required"));
  } else {
    const image = await uploadOnCloudinary(imageLocalPath);
    imageData = {
      public_id: image.public_id || "",
      url: image.secure_url || "",
    };
  }

  const addCar = await Car.create({
    ...car,
    owner: _id,
    image: imageData,
  });

  res.status(201).json(new ApiResponse(201, "Car added successfully", addCar));
});

// list the all the cars of the owner

const ownerCars = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const cars = await Car.find({ owner: _id });
  res
    .status(200)
    .json(new ApiResponse(200, "Owner's cars retrieved successfully", cars));
});

// toggle car availability

const toggleCarAvailability = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { carId } = req.body;

  const car = await Car.findOne({ _id: carId, owner: _id });

  if (!car) {
    return res.status(404).json(new ApiResponse(404, "Car not found"));
  }

  car.isAvailable = !car.isAvailable;

  await car.save();

  res.status(200).json(new ApiResponse(200, "Car toggled successfully", car));
});

// delete a car

const deleteCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { carId } = req.body;

  const car = await Car.findOne({ _id: carId, owner: _id });

  if (!car) {
   return res.status(404).json(new ApiResponse(404, "Car not found"));
  }

  await Car.findByIdAndDelete(carId);
  await Booking.deleteMany({ car: carId });
  res.status(200).json(new ApiResponse(200, "Car deleted successfully", car));
});

// get dashboard data for owner
const getOwnerDashboardData = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;
  if (role !== "owner") {
    return res.status(403).json( new ApiError(
      403,
      "Access denied. Only owners can access this resource."
    ));
  }

  const cars = await Car.find({ owner: _id });
  const bookings = await Booking.find({ owner: _id })
    .populate("car")
    .sort({ createdAt: -1 });

  const pendingBookings = await Booking.find({ owner: _id, status: "Pending" });
  const completedBookings = await Booking.find({
    owner: _id,
    status: "Confirmed",
  });
  const cancelledBookings = await Booking.find({
    owner: _id,
    status: "Cancelled",
  });

  // calculating total monthly earnings
  const monthlyEarnings = bookings
    .slice()
    .filter((booking) => booking.status === "Confirmed")
    .reduce((acc, booking) => acc + booking.price, 0);

  const dashboardData = {
    totalCars: cars.length,
    totalBookings: bookings.length,
    pendingBookings: pendingBookings.length,
    completedBookings: completedBookings.length,
    recentBookings: bookings.slice(0, 5),
    monthlyEarnings,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Owner dashboard data retrieved successfully",
        dashboardData
      )
    );
});

// onwer update a profile image

const updateProfileImage = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const imageLocalPath = req.file?.path;
  let imageData = {
    public_id: "",
    url: "",
  };
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  } else {
    const image = await uploadOnCloudinary(imageLocalPath);
    imageData = {
      public_id: image.public_id || "",
      url: image.secure_url || "",
    };
    await User.findByIdAndUpdate(_id, { image: imageData }, { new: true });
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Profile image updated successfully"));
});

export {
  changeRoleToOwner,
  addCar,
  updateProfileImage,
  ownerCars,
  toggleCarAvailability,
  deleteCar,
  getOwnerDashboardData,
};
// import asyncHandler from "../utils/asyncHandler.js";
// import{ ApiError }from "../utils/ApiError.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { Car } from "../models/car.model.js";
// import { Booking } from "../models/booking.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// // change role
// const changeRoleToOwner = asyncHandler(async (req, res) => {
//   // Implementation for changing user role to owner
//   const { _id } = req.user;

//   // Assuming you have a User model and a method to find and update the user
//   const user = await User.findByIdAndUpdate(
//     _id,
//     { role: "owner" },
//     { new: true }
//   );
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         "User role updated to owner.",
//         user
//       )
//     );
// });

// // list a car

// const addCar = asyncHandler(async (req, res) => {
//   const { _id } = req.user;

//   let car = JSON.parse(req.body.carData);

//   const imageLocalPath = req.file?.path;

//   let imageData = {
//     public_id: "",
//     url: "",
//   };

//   if (!imageLocalPath) {
//     throw new ApiError(400, "Image is required");
//   } else {
//     const image = await uploadOnCloudinary(imageLocalPath);
//     imageData = {
//       public_id: image.public_id || "",
//       url: image.secure_url || "",
//     };
//   }

//   const addCar = await Car.create({
//     ...car,
//     owner: _id,
//     image: imageData,
//   });

//   res.status(201).json(new ApiResponse(201, "Car added successfully", addCar));
// });

// // list the all the cars of the owner

// const ownerCars = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const cars = await Car.find({ owner: _id });
//   res
//     .status(200)
//     .json(new ApiResponse(200, "Owner's cars retrieved successfully" , cars));
// });

// // toggle car availability

// const toggleCarAvailability = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { carId } = req.body;

//   const car = await Car.findOne({ _id: carId, owner: _id });

//   if (!car) {
//     throw new ApiError(404, "Car not found");
//   }

//   car.isAvailable = !car.isAvailable;

//   await car.save();

//   res
//     .status(200)
//     .json(new ApiResponse(200, "Car toggled successfully", car));
// });

// // delete a car

// const deleteCar = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { carId } = req.body;

//   const car = await Car.findOne({ _id: carId, owner: _id });

//   if (!car) {
//     throw new ApiError(404, "Car not found");
//   }

//   car.owner = null;
//   car.isAvailable = false;
//   await car.save();
//   res.status(200).json(new ApiResponse(200, "Car deleted successfully" , car));
// });

// // get dashboard data for owner
// const getOwnerDashboardData = asyncHandler(async (req, res) => {
//   const { _id, role } = req.user;
//   if (role !== "owner") {
//     throw new ApiError(
//       403,
//       "Access denied. Only owners can access this resource."
//     );
//   }

//   const cars = await Car.find({ owner: _id });
//   const bookings = await Booking.find({ owner: _id })
//     .populate("car")
//     .sort({ createdAt: -1 });

//   const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
//   const completedBookings = await Booking.find({
//     owner: _id,
//     status: "confirmed",
//   });
//   const cancelledBookings = await Booking.find({
//     owner: _id,
//     status: "cancelled",
//   });

//   // calculating total monthly earnings
//   const monthlyEarnings = bookings
//     .slice()
//     .filter((booking) => booking.status === "confirmed")
//     .reduce((acc, booking) => acc + booking.price, 0);

//   const dashboardData = {
//     totalCars: cars.length,
//     totalBookings: bookings.length,
//     pendingBookings: pendingBookings.length,
//     completedBookings: completedBookings.length,
//     recentBookings: bookings.slice(0, 5),
//     monthlyEarnings,
//   };

//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         "Owner dashboard data retrieved successfully",
//           dashboardData,
//       )
//     );
// });

// // onwer update a profile image

// const updateProfileImage = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const imageLocalPath = req.file?.path;
//   let imageData = {
//     public_id: "",
//     url: "",
//   };
//   if (!imageLocalPath) {
//     throw new ApiError(400, "Image is required");
//   } else {
//     const image = await uploadOnCloudinary(imageLocalPath);
//     imageData = {
//       public_id: image.public_id || "",
//       url: image.secure_url || "",
//     };
//     await User.findByIdAndUpdate(_id, { image: imageData }, { new: true });
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, "Profile image updated successfully"));
// });

// export {
//   changeRoleToOwner,
//   addCar,
//   updateProfileImage,
//   ownerCars,
//   toggleCarAvailability,
//   deleteCar,
//   getOwnerDashboardData,
// };