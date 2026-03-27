import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Car } from "../models/car.model.js";

// generateAccessAndRefreshToken
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "user not found while generating the tokens");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch(error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went Wrong while using the access and refresh token"
    );
  }
};
// register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password,phone, cnic, address, dob, gender } = req.body;

  if ([name, email, password, phone, cnic].some((field) => field?.trim() === "")) {
     return res.status(400).json(new ApiResponse (400, "All Fields are requireds"));
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
     return res.status(400).json(new ApiResponse(409, "email is already exist"));
  }
    let imageData = {
    public_id: "",
    url: "",
  };

  const imageLocalPath = req.file?.path ;
  if (imageLocalPath) {
    const image = await uploadOnCloudinary(imageLocalPath);
    imageData={
        public_id: image.public_id || "",
        url: image.secure_url || "",
    }
  }

  

  const user = await User.create({
    name,
    email,
    image: imageData ,
    password,
    phone,        
    cnic,         
    address,      
    dob,          
    gender, 
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    return res.status(500).json(new ApiResponse(500, "Something went wrong while register user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "user Register Successfully", userCreated));
}); 

// user login

const loginUser = asyncHandler(async (req,res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, " email is required");
  }

  if (!password) {
    throw new ApiError(400, " password is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "email does not exist in this system");
  }

  const checkPassword=await user.comparePassword(password);

  if(!checkPassword){
    throw new ApiError(401,"Inavlid user credentials");
  }
   const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);;

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).cookie("accessToken", accessToken, { httpOnly: true, secure: false,sameSite: "lax" }).cookie("refreshToken", refreshToken, { httpOnly: true, secure: false,sameSite: "lax" }).json(
        new ApiResponse(200, "User logged in successfully", { user: loggedInUser })
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",    
    })
    .json(new ApiResponse(200, null, "Logged out successfully")
    );
});
// get user data using jwt token

const getUserData = asyncHandler(async (req,res) => {
    const {user}=req;
    if(!user){
        throw new ApiError(404,"user not found")
    }
    return res.status(200).json(new ApiResponse(200,"user data fetched successfully",user));
});

// all cars for frontend

const getCars=asyncHandler(async (req,res) => {
    const cars= await Car.find({isAvailable:true})
    res.status(200).json(new ApiResponse(200,"available cars fetched successfully",cars));
});






export {registerUser,loginUser,getUserData,logoutUser,getCars};

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import {User} from "../models/user.model.js";

// //genrate access and refresh token
// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });
//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "some thing went wroing while genrating refresh and acces token",
//     );
//   }
// };

// //register user
//  const registerUser = asyncHandler(async (req, res) => {
//   const {email, name, password} = req.body;
//   if ([email, name,  password].some((field) => field?.trim() === "")) {
//     throw new ApiError(400, "All fields are required");
//   }
//   const existedUser = await User.findOne({ email });
//   if (existedUser) {
//     throw new ApiError(409, "User with email or username already exists");
//   }

//   const imageLocalPath = req.files?.image[0]?.path;
//   if (!imageLocalPath) {
//     throw new ApiError(409, "Image required?");
//   }

//   const image = await uploadOnCloudinary(imageLocalPath);
//   const user = await User.create({
//     name, 
//     email,
//     image: {
//       public_id: image.public_id || "",
//       url: image.secure_url || "",
//     },
//     password,
   
//   });
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken",
//   );
//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(201, createdUser, "User registered successfully"));
// });

// //login user

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   if (!email) {
//     throw new ApiError(400, "Email is required");
//   }
//   if (!password) {
//     throw new ApiError(400, "password is required");
//   }
//   const user = await User.findOne({
//     email,
//   });
//   if (!user) {
//     throw new ApiError(400, "User email does not exist");
//   }
//   const isPasswordValid = await user.isPasswordCorrect(password);
//   if (!isPasswordValid) {
//     throw new ApiError(404, "invalid user credentials");
//   }
//   //user ka password thk ha to acces or refresh token bnao
//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id,
//   );
//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken",
//   );
//   const options={
    
//     httpOnly:true,
//     secure:true
//   }
//   return res
//     .status(201)
//     .cookie("accesToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(201, {
//         user: loggedInUser,
//         accessToken,
//         refreshToken,
//       }),
//     );
// });


// const logout=asyncHandler(async(req,res)=>{
//   return res
//     .status(200)
//     .clearCookie("accesToken",{
//       httpOnly:true,
//       secure:false,
//       sameSite:"lax"
//     })
//     .json(new ApiResponse(200,null,"Logged out successfully"))

// })
// //getuser data using jwt token
// const getUserData=asyncHandler(async(req,res)=>{
//   const {user}=req;
//   if(!user){
//     throw new ApiError(404,"User not Found")
//   }
//   return res.status(200).json(new ApiResponse(200,"user data fethced successfully ",user))
// })

// //all cars frontend 
// const getCars=asyncHandler(async(req,res)=>{
//   const cars=await Car.find({isAvailable:true})
//   res.status(200).json(new ApiResponse(200,"Available cars fetched successfully",cars))
// })
// export {registerUser,loginUser,logout,getUserData,getCars}