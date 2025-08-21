import mongoose from "mongoose";
import { CategoryModel, OrderModel, ServiceModel, WorkShopModel,ChatModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";

//----------------------------addWorkShop----------------------------------------------------
export const addWorkShop = asyncHandler(async (req, res, next) => {
    if (req.files?.mainImage?.length) {
        req.body.mainImage = await uploadImage(req.files.mainImage[0].path, "workShops");
    }else{
        return next(new AppError("Please upload the main image", 400 ));
    }
    if (req.files?.images?.length > 0) {
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
    if(req.user.confirmed!=="confirmed"){
        return next(new AppError("your account is not confirmed", 401 ));
    }
    if (req.files?.mainImage?.length) {
        req.body.mainImage = await uploadImage(req.files.mainImage[0].path, "services");
    }
    if (req.files?.images?.length !== 0) {
        req.body.images = [];
        for (let i = 0; i < req.files?.images?.length; i++) {
            let { secure_url, public_id } = await uploadImage(req.files.images[i].path, "services");
            req.body.images.push({ secure_url, public_id });
        }
    }
    const category=await CategoryModel.findOne({_id:new mongoose.Types.ObjectId(req.user.profession),deletedBy:{$exists:false}});
    if(!category){
        return next(new AppError("Category not found or deleted", 404 ));
    }
    req.body.providerId = new mongoose.Types.ObjectId(req.user._id);
    req.body.categoryId = new mongoose.Types.ObjectId(req.user.profession);
    if(req.body.days){
        req.body.days=JSON.parse(req.body.days);
    }

    let service = await ServiceModel.create({...req.body});
    service=service.populate([
        {path:"providerId"},
        {path:"categoryId"},
    ])
    return res.status(201).json(service);
});

//----------------------------updateService----------------------------------------------------
export const updateService = asyncHandler(async (req, res, next) => {
    let service = await ServiceModel.findOne({ _id: req.params.id, deletedBy: { $exists: false } });
    if(!service){
        return next(new AppError("service not found or deleted", 404 ));
    }
    if (service.providerId.toString() !== req.user._id.toString()) {
        return next(new AppError("you are not the provider of this service", 403));
    }
    if (req.files?.mainImage?.length) {
        service.mainImage = await uploadImage(req.files.mainImage[0].path, "services");
    }
    if (req.files?.images?.length !== 0) {
        req.body.images = [];
        for (let i = 0; i < req.files?.images?.length; i++) {
            let { secure_url, public_id } = await uploadImage(req.files.images[i].path, "services");
            req.body.images.push({ secure_url, public_id });
        }
        service.images=req.body.images;
    }
    if(req.body.days){
        service.days=JSON.parse(req.body.days);
    }
    if(req.body.title){
        service.title=req.body.title;
    }
    if(req.body.description){
        service.description=req.body.description;
    }
    if (req.body.minPrice) {
        service.minPrice = req.body.minPrice;
    }
    if (req.body.maxPrice) {
        service.maxPrice = req.body.maxPrice;
    }
    if (req.body.duration) {
        service.duration = req.body.duration;
    }

    await service.save();
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

//----------------------------getMyOrders----------------------------------------------------
export const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders=await OrderModel.find({providerId:new mongoose.Types.ObjectId(req.user._id),deletedBy:{$exists:false}})
    .populate([
        {path:"serviceId"},
        {path:"userId"},
    ]);
    if(orders.length==0){
        return next(new AppError("you have no orders yet", 404 ));
    }
    return res.status(200).json(orders);
});

//----------------------------getSpecificOrder----------------------------------------------------
export const getSpecificOrder = asyncHandler(async (req, res, next) => {
    const order=await OrderModel.findById(req.params.id)
    .populate([
        {path:"serviceId"},
        { path: "userId" },
        { path: "providerId" },
    ]);
    if(!order){
        return next(new AppError("order not found", 404 ));
    }
// if(order.providerId.toString()!==req.user._id.toString()){
//     return next(new AppError("you are not the provider of this order", 403));
// }
    return res.status(200).json(order);
});

//----------------------------acceptOrRejectOrder----------------------------------------------------
export const acceptOrRejectOrder = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findOne({ _id: req.body.orderId,status:"pending", deletedBy: { $exists: false } });
    if (!order) {
        return next(new AppError("order not found or deleted", 404));
    }
    if(req.user._id.toString()!==order.providerId.toString()){
        return next(new AppError("you are not the provider of this order", 403));
    }
    order.status=req.body.status;
    await order.save();
    if (req.body.status === "accepted") {
  const existingChat = await ChatModel.findOne({
    userId: order.userId,
    providerId: order.providerId,
  });

  if (!existingChat) {
    await ChatModel.create({ userId: order.userId, providerId: order.providerId,orderId:order._id });
  }else{
    existingChat.orderId=order._id;
    await existingChat.save();
  }
}
    return res.status(200).json(order);
});

//----------------------------orderDatails----------------------------------------------------
export const orderDatails = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findOne({ _id: req.params.id,providerId:new mongoose.Types.ObjectId(req.user._id), deletedBy: { $exists: false } });
    console.log(req.user._id);
    if (!order) {
        return next(new AppError("order not found or deleted or you are not the provider of this order", 404));
    }
    order.price = req.body.price;
    if(req.body.deliveryDate){
        
        order.deliveryDate=req.body.deliveryDate;
    }
    if(req.body.address){
        
        order.address=req.body.address;
    }
    if(req.body.paymentMethod){
        
        order.paymentMethod=req.body.paymentMethod;
    }
    if(req.body.comment){
        
        order.comment=req.body.comment;
    }

    await order.save();
    return res.status(200).json(order);

});