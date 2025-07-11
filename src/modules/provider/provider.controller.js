import { Router } from "express";
import * as PS from "./provider.service.js"
import * as PV from "./provider.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls, rolesTypes } from "../../utils/generalRules/index.js";
import { authentication, authorization } from "../../middleware/auth.js";

const providerRouter = Router();

providerRouter.post("/addWorkShop",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
  {name:"mainImage",maxCount:1},
  {name:"images",maxCount:10},
]),validation(PV.addWorkShopSchema),authentication,authorization([rolesTypes.provider]),PS.addWorkShop)

providerRouter.post("/addService",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
  {name:"mainImage",maxCount:1},
  {name:"images",maxCount:10},
]),validation(PV.addServiceSchema),authentication,authorization([rolesTypes.provider]),PS.addService)


providerRouter.get("/getMyWorkShops",validation(PV.authorizationSchema),authentication,authorization([rolesTypes.provider]),PS.getmyWorkShops)
providerRouter.get("/getMyServices",validation(PV.authorizationSchema),authentication,authorization([rolesTypes.provider]),PS.getmyServices)
providerRouter.delete("/deleteWorkShop/:id",validation(PV.deleteWorlShopOrServiceSchema),authentication,authorization([rolesTypes.provider,rolesTypes.admin]),PS.deleteWorkShop)
providerRouter.delete("/deleteService/:id",validation(PV.deleteWorlShopOrServiceSchema),authentication,authorization([rolesTypes.provider,rolesTypes.admin]),PS.deleteService)

export default providerRouter;