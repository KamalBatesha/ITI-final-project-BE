import mongoose from "mongoose";
import { CategoryModel, ServiceModel, WorkShopModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { asyncHandler } from "../../utils/globalErrorHandling/index.js";

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

    const workShop = await WorkShopModel.findOne({ providerId });
    if (workShop) {
        workShop.items.push(req.body);
        await workShop.save();
        return res.status(201).json(workShop);
    }
    const workShopData = await WorkShopModel.create({ items: [req.body], providerId: req.user._id });
    return res.status(201).json(workShopData);

});

//----------------------------addService----------------------------------------------------
export const addService = asyncHandler(async (req, res, next) => {
    if (req.files?.image?.length == 0) {
        return next(new AppError("Please upload service image", 400));
    }
    const category=await CategoryModel.findOne({_id:req.body.categoryId,deletedBy:{$exists:false}});
    if(!category){
        return next(new AppError("Category not found or deleted", 404 ));
    }
    let { secure_url, public_id } = await uploadImage(req.files.image[0].path, "services");
    req.body.image = { secure_url, public_id };


    req.body.providerId = new mongoose.Types.ObjectId(req.user._id);

    const service = await ServiceModel.create({...req.body,days:JSON.parse(req.body.days)});
    return res.status(201).json(service);
});