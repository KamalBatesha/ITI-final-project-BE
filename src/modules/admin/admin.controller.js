import { Router } from "express";
import * as AS from "./admin.service.js"
import * as AV from "./admin.validation.js"
import { validation } from "../../middleware/validation.js";
import { rolesTypes } from "../../utils/generalRules/index.js";
import { authentication, authorization } from "../../middleware/auth.js";

const adminRouter = Router();

adminRouter.post("/confirmAccount/:id",validation(AV.confirmAccountSchema),authentication,authorization([rolesTypes.admin]),AS.confirmAccount)
adminRouter.post("/confirmService/:id",validation(AV.confirmAccountSchema),authentication,authorization([rolesTypes.admin]),AS.confirmService)
adminRouter.post("/confirmWorkShop/:id",validation(AV.confirmAccountSchema),authentication,authorization([rolesTypes.admin]),AS.confirmWorkShop)
adminRouter.get("/getAllOrders",validation(AV.authorizationSchema),authentication,authorization([rolesTypes.admin]),AS.getAllOrders)
adminRouter.post("/makeAdmin/:id",validation(AV.confirmAccountSchema),authentication,authorization([rolesTypes.admin]),AS.makeAdmin)
adminRouter.get("/getUnconfirmedWorkShops",validation(AV.authorizationSchema),authentication,authorization([rolesTypes.admin]),AS.getUnconfirmedWorkShops)
adminRouter.get("/getUnconfirmedServices",validation(AV.authorizationSchema),authentication,authorization([rolesTypes.admin]),AS.getUnconfirmedServices)
adminRouter.get("/getUnconfirmedUsers",validation(AV.authorizationSchema),authentication,authorization([rolesTypes.admin]),AS.getUnconfirmedUsers)

export default adminRouter;