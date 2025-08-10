import mongoose from "mongoose";
import { UserModel } from "../../DB/models/user.model.js";
import { rolesTypes } from "../../utils/generalRules/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";
import { WorkShopModel,ServiceModel, CategoryModel, OrderModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";

//----------------------------getMyProfile----------------------------------------------------
export const getMyProfile = asyncHandler(async (req, res, next) => {
    if(req.user.role==rolesTypes.provider){
        const user = await UserModel.findById(req.user._id).populate([
            {path:"workshops",match:{deletedBy:{$exists:false}},select:"title mainImage"},
            {path:"services",match:{deletedBy:{$exists:false}},select:"title mainImage"}
        ]);
        return res.status(200).json(user);
    }
    return res.status(200).json(req.user);
});

//----------------------------getProfile----------------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
    let user = await UserModel.findOne({_id:req.params.id,deletedAt:{$exists:false}});
    if(user.role==rolesTypes.provider){
        user=await user.populate([
            {path:"workshops",match:{deletedBy:{$exists:false},isConfirmed:true},select:"title mainImage"},
            {path:"services",match:{deletedBy:{$exists:false},isConfirmed:true},select:"title mainImage"}
        ])
    }
    return res.status(200).json(user);
});


//----------------------------getService----------------------------------------------------
export const getService = asyncHandler(async (req, res, next) => {
    let service = await ServiceModel.findOne({_id:req.params.id,deletedBy:{$exists:false}});
    if(!service){
        return next(new AppError("Service not found or deleted", 404 ));
    }
    return res.status(200).json(service);
});

//----------------------------getWorkShop----------------------------------------------------
export const getWorkShop = asyncHandler(async (req, res, next) => {
    let workShop = await WorkShopModel.findOne({_id:req.params.id,deletedBy:{$exists:false}});
    if(!workShop){
        return next(new AppError("WorkShop not found or deleted", 404 ));
    }
    return res.status(200).json(workShop);
});

//----------------------------getServiceByCategory----------------------------------------------------
export const getServiceByCategory = asyncHandler(async (req, res, next) => {
    let category=await CategoryModel.findOne({_id:req.params.id,deletedBy:{$exists:false}});
    if(!category){
        return next(new AppError("Category not found or deleted", 404 ));
    }
    let services = await ServiceModel.find({categoryId:req.params.id,deletedBy:{$exists:false}});
    if(services.length==0){
        return next(new AppError("this category has no services yet", 404 ));
    }
    return res.status(200).json({category,services});
});

//----------------------------getServiceByName----------------------------------------------------
export const getServiceByName = asyncHandler(async (req, res, next) => {
    let {name}=req.query;
    let service = await ServiceModel.find({title:{$regex:name,$options:"i"},deletedBy:{$exists:false}});
    if(service.length==0){
        return next(new AppError("there is no service with this name", 404 ));
    }
    return res.status(200).json(service);
});

//----------------------------order----------------------------------------------------
export const order = asyncHandler(async (req, res, next) => {
    if(req.user.confirmed!=="confirmed"){
        return next(new AppError("your account is not confirmed", 401 ));
    }
    const service=await ServiceModel.findOne({_id:req.body.serviceId,deletedBy:{$exists:false}});
    if(!service){
        return next(new AppError("Service not found or deleted", 404 ));
    }
    if(req.user._id.toString()==service.providerId.toString()){
        return next(new AppError("you can't order your own service", 403 ));
    }
    const provider=await UserModel.findOne({_id:new mongoose.Types.ObjectId(service.providerId),deletedAt:{$exists:false}});
    console.log(provider);
    
    if(!provider){
        return next(new AppError("Provider not found or deleted", 404 ));
    }
    if(req.files.length!==0){
        req.body.image = await uploadImage(req.files.image[0].path, "orders");
    }
    let order=await OrderModel.create({description:req.body.description,serviceId:service._id,providerId:provider._id,userId:new mongoose.Types.ObjectId(req.user._id),image:req.body.image,deliveryDate:new Date(req.body.deliveryDate)});
    order=await order.populate([
        {path:"serviceId"},
        {path:"providerId"},
        {path:"userId"},

    ])
    return res.status(200).json(order);
});

//----------------------------getMyOrders----------------------------------------------------
export const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders=await OrderModel.find({userId:new mongoose.Types.ObjectId(req.user._id),deletedBy:{$exists:false}}).populate([
        {path:"serviceId"},
        {path:"providerId"},
        {path:"userId"},

    ]);
    if(orders.length==0){
        return next(new AppError("you have no orders yet", 404 ));
    }
    return res.status(200).json(orders);
});
//----------------------------confirmOrder----------------------------------------------------
export const confirmOrder = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findOne({ _id: req.params.id,status:"accepted",userId:new mongoose.Types.ObjectId(req.user._id), deletedBy: { $exists: false } });
    if (!order) {
        return next(new AppError("order not found or deleted or you are not the user of this order", 404));
    }
    order.status="confirmed";
    await order.save();
    return res.status(200).json(order);
});

