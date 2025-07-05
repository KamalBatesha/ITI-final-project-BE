// top of your file
import connectionDB from "./DB/connectionDb.js";
import { AppError, globalErrorHandller } from "./utils/globalErrorHandling/index.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to the API");
  });

  connectionDB();

  app.use(/.*/, (req, res, next) => {
  return next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

  // global error handler
  app.use(globalErrorHandller);
};

export default bootstrap;
