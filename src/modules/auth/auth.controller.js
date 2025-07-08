import { Router } from "express";

import * as AS from "./auth.service.js"
import * as AV from "./auth.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls } from "../../utils/generalRules/index.js";
import { authentication } from "../../middleware/auth.js";

const authRouter = Router();

authRouter.post("/signUp",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
  {name:"profilePic",maxCount:1},
  {name:"identityPic",maxCount:3},
]),validation(AV.signUpSchema),AS.signUp)

authRouter.get("/confirmEmail/:token",validation(AV.confirmEmailSchema),AS.confirmEmail)
authRouter.post("/signIn",validation(AV.signInSchema),AS.signIn)
// authRouter.post("/loginWithGmail",validation(AV.loginWithGmailSchema),AS.loginWithGmail)
authRouter.post("/forgetPassword",validation(AV.forgetPasswordSchema),AS.forgetPassword)
authRouter.post("/resetPassword",validation(AV.resetPasswordSchema),authentication,AS.resetPassword)
// authRouter.post("/refreshToken",validation(AV.refreshTokenSchema),AS.refreshToken)



export default authRouter;
