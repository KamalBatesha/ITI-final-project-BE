import { Router } from "express";
import * as US from "./user.service.js"
import * as UV from "./user.validation.js"
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { multerHost } from './../../middleware/multer.js';
import { generalRuls } from "../../utils/generalRules/index.js";

const userRouter = Router();

userRouter.get("/getMyProfile",validation(UV.authorizationSchema),authentication,US.getMyProfile)
userRouter.get("/getProfile/:id",validation(UV.idSchema),US.getProfile)
userRouter.get("/getService/:id",validation(UV.idSchema),US.getService)
userRouter.get("/getWorkShop/:id",validation(UV.idSchema),US.getWorkShop)
userRouter.get("/getServiceByCategory/:id",validation(UV.idSchema),US.getServiceByCategory)
userRouter.get("/getServiceByName",validation(UV.getServiceByNameSchema),US.getServiceByName)
userRouter.post("/order",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
  {name:"image",maxCount:1},
]),validation(UV.orderSchema),authentication,US.order)
userRouter.get("/getMyOrders",validation(UV.authorizationSchema),authentication,US.getMyOrders)
userRouter.post("/confirmOrderOrCancel/:id",validation(UV.confirmOrderSchema),authentication,US.confirmOrderOrCancel)


// userRouter.put("/updateMyProfile",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
//     {name:"profilePic",maxCount:1},
//     {name:"identityPic",maxCount:3},
// ]),validation(UV.updateMyProfileSchema),US.updateMyProfile)

export default userRouter;