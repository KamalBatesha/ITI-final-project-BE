import { UserModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";
import {eventEmitter} from "../../utils/sendEmailEvent/index.js";
import {generateToken, verifyToken} from "../../utils/token/index.js";
import {Compare, Hash} from "../../utils/hash/index.js";
import { decodedToken, tokenTypes } from "../../middleware/auth.js";
import { customAlphabet } from 'nanoid';
import { rolesTypes } from "../../utils/generalRules/index.js";

//----------------------------signUp----------------------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
  const {email,phone} = req.body;

  const emailExist = await UserModel.findOne({email });
  if (emailExist) {
    return next(new AppError("email already exist", 409 ));
  }
    const phoneExist = await UserModel.findOne({phone });
    console.log(phoneExist,"======================");
    
  if (phoneExist) {
    return next(new AppError("phone already exist", 409 ));
  }
  // upload image cloudinary
  if (req.files?.profilePic?.length) {
    req.body.profilePic = await uploadImage(req.files.profilePic[0].path, "profilePic");
  }
  if (!req.files?.identityPic?.length>2) {
    return next(new AppError("Please upload the 3 identity pictures", 400 ));
    }
    req.body.identityPic = [];
    for (let i = 0; i < req.files?.identityPic?.length; i++) {
      let { secure_url, public_id } = await uploadImage(req.files.identityPic[i].path, "identityPic");
      req.body.identityPic.push({ secure_url, public_id });
    }
    eventEmitter.emit("sendEmailConfirmation", { email });
    // create user
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  

});

//----------------------------confirmEmail----------------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const {token} = req.params;
  console.log(req.params);
  
  console.log(token);
  
  const {email}=await verifyToken({token,SIGNATURE:process.env.SIGNATURE_TOKEN_EMAIL});
  const user = await UserModel.findOne({email,isEmailVerified:false});
  if (!user) {
    return next(new AppError("user not found or email is already verified", 404 ));
  }
  user.isEmailVerified = true;
  await user.save();
  res.status(200).json(user);
});

//----------------------------signIn----------------------------------------------------
export const signIn = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  console.log(req.body);
  
  const user = await UserModel.findOne({email,isEmailVerified:true});
  if (!user) {
    return next(new AppError("user not found or email is not verified", 404 ));
  }
  const isPasswordMatch = await Compare({ key: password, hashed: user.password });
  if (!isPasswordMatch) {
    return next(new AppError("password is not correct", 401 ));
  }
  // generate token
  let refresh_token=null;
  let acess_token=null;
  if(user.role=="admin"){
     refresh_token = await generateToken({ payload: { id: user._id ,email}, SIGNATURE: process.env.REFRESH_SIGNATURE_TOKEN_ADMIN, option: { expiresIn: "30d" } });
     acess_token = await generateToken({ payload: { id: user._id ,email}, SIGNATURE: process.env.ACESS_SIGNATURE_TOKEN_ADMIN, option: { expiresIn: "1d" } });
  }else{
     refresh_token = await generateToken({ payload: { id: user._id ,email}, SIGNATURE: process.env.REFRESH_SIGNATURE_TOKEN_USER, option: { expiresIn: "30d" } });
     acess_token = await generateToken({ payload: { id: user._id ,email}, SIGNATURE: process.env.ACESS_SIGNATURE_TOKEN_USER, option: { expiresIn: "1d" } });
  }
  res.status(200).json({ refresh_token, acess_token });
});
//----------------------------forgetPassword----------------------------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const {email} = req.body;
  console.log(req.body);
  
  const user = await UserModel.findOne({email,isEmailVerified:true});
  if (!user) {
    return next(new AppError("user not found or email is not verified", 404 ));
  }
  eventEmitter.emit("forgetPassword", { email });
  res.status(200).json({ message: "email sent successfully" });
});

//----------------------------resetPassword----------------------------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const{password}=req.body;
  req.user.password=password;
  await req.user.save();
  res.status(200).json({ message: "password reset successfully" }); 
});

//----------------------------refreshToken----------------------------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user=await decodedToken({authorization,tokenType:tokenTypes.refresh,next})
  if(!user){
    return next(new AppError("invalid token" ,401 ));
  }
  
  // generate accessToken
  const accessToken = await generateToken({
    payload: { email: user.email, id: user._id },
    SIGNATURE:
      user.role == rolesTypes.user
        ? process.env.ACESS_SIGNATURE_TOKEN_USER
        : process.env.ACESS_SIGNATURE_TOKEN_ADMIN,
    option: { expiresIn: "1d" },
  });

  return res
    .status(200)
    .json({ message: "done",  accessToken  });
});

//----------------------------confirmPhoneNember----------------------------------------------------
// export const sendPhoneNemberOtp = asyncHandler(async (req, res, next) => {
//     const otp=customAlphabet("0123456789",4)();
//   // hash otp
//   const hashedOtp = await Hash({key:otp,SALT_ROUNDS : process.env.SALT_ROUNDS});
//   req.user.phoneOTP=hashedOtp;
//   await sendVerificationCode(req.user.phone,otp);
//   await req.user.save();
//   res.status(200).json({ message: "done" });
// });