import mongoose from "mongoose";
import { CategoryModel, OrderModel, ServiceModel, WorkShopModel,ChatModel, UserModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";

//----------------------------confirmAccount----------------------------------------------------
export const confirmAccount = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({_id:req.params.id,confirmed:"pending"});
    if (!user) {
        return next(new AppError("User not found or already confirmed", 404));
    }
    user.confirmed = true;
    await user.save();
    return res.status(200).json(user);
});

//----------------------------confirmService----------------------------------------------------
export const confirmService = asyncHandler(async (req, res, next) => {
    const service = await ServiceModel.findOne({_id:req.params.id,isConfirmed:false});
    if (!service) {
        return next(new AppError("service not found or already confirmed", 404));
    }
    service.isConfirmed = true;
    await service.save();
    return res.status(200).json(service);
});

//----------------------------confirmWorkShop----------------------------------------------------
export const confirmWorkShop = asyncHandler(async (req, res, next) => {
    const WorkShop = await WorkShopModel.findOne({_id:req.params.id,isConfirmed:false});
    if (!WorkShop) {
        return next(new AppError("WorkShop not found or already confirmed", 404));
    }
    WorkShop.isConfirmed = true;
    await WorkShop.save();
    return res.status(200).json(WorkShop);
});

//----------------------------makeAdmin----------------------------------------------------
export const makeAdmin = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({_id:req.params.id,role:"user"});
    if (!user) {
        return next(new AppError("User not found or already admin", 404));
    }
    user.role = "admin";
    await user.save();
    return res.status(200).json(user);
});

//----------------------------getUnconfirmedWorkShops----------------------------------------------------
export const getUnconfirmedWorkShops = asyncHandler(async (req, res, next) => {
    const workShops = await WorkShopModel.find({ isConfirmed: false });
    if (workShops.length == 0) {
        return next(new AppError("there is no unconfirmed workShops yet", 404));
    }
    return res.status(200).json(workShops);
});

//----------------------------getUnconfirmedServices----------------------------------------------------
export const getUnconfirmedServices = asyncHandler(async (req, res, next) => {
    const services = await ServiceModel.find({ isConfirmed: false });
    if (services.length == 0) {
        return next(new AppError("there is no unconfirmed services yet", 404));
    }
    return res.status(200).json(services);
});


//----------------------------getUnconfirmedUsers----------------------------------------------------
export const getUnconfirmedUsers = asyncHandler(async (req, res, next) => {
    const users = await UserModel.find({ confirmed:{$ne:"confirmed"}  });
    if (users.length == 0) {
        return next(new AppError("there is no unconfirmed users yet", 404));
    }
    return res.status(200).json(users);
});