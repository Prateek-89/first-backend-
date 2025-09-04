import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

// 🔹 Generate Tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// 🔹 Register User
const registerUser = asyncHandler(async (req, res) => {

  const { fullName, username, email, password } = req.body;

  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({

    $or: [{ username }, { email }],

  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({

    fullName,

    username: username.toLowerCase(),

    email,

    password,

    avatar: avatar.url,

    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(

    "-password -refreshToken"

  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// 🔹 Login User
const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({

    $or: [{ username }, { email }],

  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {

    throw new ApiError(401, "Invalid user credentials");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {

    httpOnly: true,

    secure: process.env.NODE_ENV === "production", 
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(

      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

//  Logout User
const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(

    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {

    httpOnly: true,

    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken=asyncHandler(async(req,res)=>{

  const incomingRefreshToken= req.cookies.refreshToken||req.body.refreshAccessToken

 if (!incomingRefreshToken) {
  throw new ApiError(401,"Unauthorised request")
 }
 try {

  const decodedToken=jwt.verify(

    incomingRefreshToken,

    process.env.REFRESH_TOKEN_SECRET
  )

  const user =await User.findById(decodedToken?.id)

  if (!user) {
   throw new ApiError(401,"invalid refresh Token")
  }

  if (incomingRefreshToken !==user?.refreshToken) {
   throw new ApiError(401," Refresh Token is used or expired")
  }
 
  const options ={

    httpOnly:true,

    secure:true

  }

  const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
  
  return res 
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(

    new ApiResponse(
     200,

     {accessToken,refreshToken:newRefreshToken},

     "Access Token Refreshed Successfully"

    )

  )

} catch (error) {

  throw new ApiError(401,error?.message|| "invalid Refresh Token")
}
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{

const{oldPassword,newPassword}=req.body

const user= await user.findById(req.user?._id)

const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

if(!isPasswordCorrect){

  throw new ApiError(400,"invalid old password")

}

user.password=newPassword

await user.save({validateBeforeSave:false})

return res
.status(200)
.json (new ApiResponse(200,{},"Password changes successfully"))


})
const getCurrentUser=asyncHandler(async(req,res)=>{
return res
.status(200)
.json (200,req.user,"current user fetched succcessfully")
})
const updateAccountDetails =asyncHandler(async(req,res)=>{
  const {fullName,email}=req.body
  if (!fullName|| ! email) {
    throw new ApiError(400,"All fields are required")
  }
User.findByIdAndUpdate 

(req.user?._id,{

  $et:{
  
  fullname,

  email:email

}

},

{

  new:true

}).select("-password -")
return res
.status(200)
.json(new ApiResponse(200,user,"Account Details Updated Successfully "))

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
  const avatarLocalPath=req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar is missing")
  }
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  if (!avatar.url) {
    throw new ApiError(400,"Error While Uploading On Avatar")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
$set:{
  avatar:avatar.url
}
    },
    {
      new:true
    }
  ).select("-password")
  return res
  .status(200)
  .json(
    new ApiResponse(200,user,"Avatar update successfully")
  )
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
  const coverImageLocalPath=req.file?.path
  if (!coverImageLocalPath) {
    throw new ApiError(400,"Cover Image is missing")
  }
  const CoverImage=await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage.url) {
    throw new ApiError(400,"Error While Uploading On CoverImage")
  }
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
$set:{
  coverImage:coverImage.url
}
    },
    {
      new:true
    }
  ).select("-password")
  return res
  .status(200)
  .json(
    new ApiResponse(200,user,"cover image update successfully")
  )
})

export { 
  registerUser, 
  loginUser, 
  logoutUser,
  refreshAccessToken ,
  changeCurrentPassword, 
  getCurrentUser,
updateAccountDetails,
updateUserCoverImage,
updateUserAvatar
};
