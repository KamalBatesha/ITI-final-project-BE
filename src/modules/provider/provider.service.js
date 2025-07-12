import mongoose from "mongoose";
import { CategoryModel, ServiceModel, WorkShopModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";

//----------------------------addWorkShop----------------------------------------------------
export const addWorkShop = asyncHandler(async (req, res, next) => {
    if (req.files?.mainImage?.length) {
        req.body.mainImage = await uploadImage(req.files.mainImage[0].path, "workShops");
    }
    if (req.files?.images?.length == 0) {
        return next(new AppError("Please upload at least one image", 400));
    } else {
        req.body.images = [];
        for (let i = 0; i < req.files?.images?.length; i++) {
            let { secure_url, public_id } = await uploadImage(req.files.images[i].path, "workShops");
            req.body.images.push({ secure_url, public_id });
        }
    }
    console.log(req.body);
    const providerId = new mongoose.Types.ObjectId(req.user._id)

    // const workShop = await WorkShopModel.findOne({ providerId });
    // if (workShop) {
    //     workShop.items.push(req.body);
    //     await workShop.save();
    //     return res.status(201).json(workShop);
    // }
    const workShopData = await WorkShopModel.create({ providerId, ...req.body });
    return res.status(201).json(workShopData);

});

//----------------------------addService----------------------------------------------------
export const addService = asyncHandler(async (req, res, next) => {
    if (req.files?.mainImage?.length) {
        req.body.mainImage = await uploadImage(req.files.mainImage[0].path, "workShops");
    }
    if (req.files?.images?.length == 0) {
        return next(new AppError("Please upload at least one image", 400));
    } else {
        req.body.images = [];
        for (let i = 0; i < req.files?.images?.length; i++) {
            let { secure_url, public_id } = await uploadImage(req.files.images[i].path, "workShops");
            req.body.images.push({ secure_url, public_id });
        }
    }
    const category=await CategoryModel.findOne({_id:req.body.categoryId,deletedBy:{$exists:false}});
    if(!category){
        return next(new AppError("Category not found or deleted", 404 ));
    }
    req.body.providerId = new mongoose.Types.ObjectId(req.user._id);

    const service = await ServiceModel.create({...req.body,days:JSON.parse(req.body.days)});
    return res.status(201).json(service);
});

//----------------------------getmyWorkShops----------------------------------------------------
export const getmyWorkShops = asyncHandler(async (req, res, next) => {
    const workShops = await WorkShopModel.find({ providerId: new mongoose.Types.ObjectId(req.user._id), deletedBy: { $exists: false } });
    if (workShops.length == 0) {
        return next(new AppError("there is no workShops yet", 404));
    }
    return res.status(200).json(workShops);
});

//----------------------------getmyServices----------------------------------------------------
export const getmyServices = asyncHandler(async (req, res, next) => {
    const services = await ServiceModel.find({ providerId: new mongoose.Types.ObjectId(req.user._id), deletedBy: { $exists: false } });
    if (services.length == 0) {
        return next(new AppError("there is no services yet", 404));
    }
    return res.status(200).json(services);
});

//----------------------------deleteWorkShop----------------------------------------------------
export const deleteWorkShop = asyncHandler(async (req, res, next) => {
    const workShop = await WorkShopModel.findOne({ _id: req.params.id, deletedBy: { $exists: false } });
    if (!workShop) {
        return next(new AppError("workShop not found or deleted", 404));
    }
    if(req.user._id.toString()==workShop.providerId.toString() || req.user.role=="admin"){
        workShop.deletedBy = new mongoose.Types.ObjectId(req.user._id);
        await workShop.save();
        return res.status(200).json(workShop);
    }else{
        return next(new AppError("you are not the provider of this workShop", 403));
    }
});

//----------------------------deleteService----------------------------------------------------
export const deleteService = asyncHandler(async (req, res, next) => {
    const service = await ServiceModel.findOne({ _id: req.params.id, deletedBy: { $exists: false } });
    if (!service) {
        return next(new AppError("service not found or deleted", 404));
    }
    if(req.user._id.toString()==service.providerId.toString() || req.user.role=="admin"){
        service.deletedBy = new mongoose.Types.ObjectId(req.user._id);
        await service.save();
        return res.status(200).json(service);
    }else{
        return next(new AppError("you are not the provider of this service", 403));
    }
});