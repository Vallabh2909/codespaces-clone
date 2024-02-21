import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary, { deleteImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { name, email, username, password } = req.body;
  
    //checking if any field is empty
    if (
      [name, email, username, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    //user with same username or email exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
  
    if (existingUser) {
      throw new ApiError(409, "User with same email or username exists");
    }
  
    let avatarLocalPath;
    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.avatar) 
      ) {
        avatarLocalPath = req.files?.avatar[0]?.path;
      }
    
    if (
      req.files &&
      Array.isArray(req.files.coverImage) 
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }
  
  
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  
  
    const user = await User.create({
      name,
      avatar: avatar?.url || "",
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    if (!createdUser) {
      throw new ApiError(501, "Internal Server Error ");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Succesfully"));
  });
  export { registerUser };