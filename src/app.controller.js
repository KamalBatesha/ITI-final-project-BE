// top of your file
import connectionDB from "./DB/connectionDb.js";
import { UserModel } from "./DB/models/user.model.js";
import authRouter from "./modules/auth/auth.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import providerRouter from "./modules/provider/provider.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { AppError, globalErrorHandller } from "./utils/globalErrorHandling/index.js";
import chatRouter from "./modules/chat/chat.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import  cors from 'cors';

const bootstrap = (app, express) => {
  app.use(cors({
    origin: '*',
  }))
  app.use(express.json());
  app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to the API");
  });

  connectionDB();
  // app.get("/users", (req, res, next) => {
  //   UserModel.find()
  //   .then((users) => {
  //     res.status(200).json(users);
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
  // })

  app.use("/user",userRouter);
  app.use("/auth",authRouter);
  app.use("/provider",providerRouter);
  app.use("/category",categoryRouter);
  app.use("/chat", chatRouter);
  app.use("/admin", adminRouter);

  app.use(/.*/, (req, res, next) => {
  return next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

  // global error handler
  app.use(globalErrorHandller);
};

export default bootstrap;
