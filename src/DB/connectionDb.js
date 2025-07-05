import mongoose from "mongoose";

const connectionDB = async () => {
  mongoose
    .connect(process.env.mongooseUrl)
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(`error to connect to DB ${err}`));
};
export default connectionDB;
