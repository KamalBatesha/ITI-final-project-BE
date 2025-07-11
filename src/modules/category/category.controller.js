import { Router } from "express";
import * as CS from "./category.service.js"
import * as CV from "./category.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls, rolesTypes } from "../../utils/generalRules/index.js";
import { authentication, authorization } from "../../middleware/auth.js";

const categoryRouter = Router();

categoryRouter.post("/",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
  {name:"image",maxCount:1},
]),validation(CV.addCategorySchema),authentication,authorization([rolesTypes.admin]),CS.addCategory)

categoryRouter.get("/",CS.getCategories)
categoryRouter.get("/:id",validation(CV.getCategorySchema),CS.getCategory)
categoryRouter.delete("/:id",authentication,authorization([rolesTypes.admin]),validation(CV.deleteCategorySchema),CS.deleteCategory)

export default categoryRouter;