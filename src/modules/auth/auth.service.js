import { UserModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling";

//----------------------------signUp----------------------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
  const {email} = req.body;

  const emailExist = await UserModel.findOne({ email });
  if (emailExist) {
    return next(new AppError("email already exist", 409 ));
  }
    const mobileNumberExist = await UserModel.findOne({ mobileNumber });
  if (mobileNumberExist) {
    return next(new AppError("mobile Number already exist", 409 ));
  }

  //upload image cloudinary
  if (req.files?.profilePic?.length) {
    req.body.profilePic = await uploadImage(req.files.profilePic[0].path, "profilePic");
  }
  // send otp
  eventEmitter.emit("sendEmailConfirmation", { email });
  // create user
  const user = await UserModel.create(req.body);
  return res.status(200).json({ message: "done", user });
});