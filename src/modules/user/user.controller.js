import { Router } from "express";
import * as US from "./user.service.js"
import * as UV from "./user.validation.js"
import { validation } from "../../middleware/validation.js";

const userRouter = Router();

