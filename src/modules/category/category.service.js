import mongoose from "mongoose";
import { CategoryModel, UserModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";

//----------------------------addCategory----------------------------------------------------
export const addCategory = asyncHandler(async (req, res, next) => {
    if (req.files?.image?.length) {
        req.body.image = await uploadImage(req.files.image[0].path, "categorys");
    }else{
        return next(new AppError("Please upload category image", 400 ));
    }
    const category = await CategoryModel.create({...req.body,addedBy:new mongoose.Types.ObjectId(req.user._id)});
    return res.status(201).json(category);

});

//----------------------------getCategories----------------------------------------------------
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await CategoryModel.find({ deletedBy: { $exists: false } })
    .populate([{ path: "providerNumber", select: "_id" },
        { path: "servicesNumber", select: "_id" }]
    );

  if (categories.length === 0) {
    return next(new AppError("لا توجد فئات بعد أو تم حذفها", 404));
  }

  const response = categories.map(cat => ({
    _id: cat._id,
    title: cat.title,
    description: cat.description,
    image: cat.image,
    addedBy: cat.addedBy,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    providerCount: cat.providerNumber.length,
    servicesCount: cat.servicesNumber.length
  }));

  return res.status(200).json({categories:response,total:categories.length});
});


//----------------------------getCategorie----------------------------------------------------
export const getCategory = asyncHandler(async (req, res, next) => {
    const categorie = await CategoryModel.findOne({_id:req.params.id,deletedBy:{$exists:false}});
    if(!categorie){
        return next(new AppError("Categorie not found or deleted", 404 ));
    }
    return res.status(200).json(categorie);
});

//----------------------------deleteCategorie----------------------------------------------------
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const categorie = await CategoryModel.findOneAndUpdate({_id:req.params.id},{deletedBy:new mongoose.Types.ObjectId(req.user._id)},{new:true});
    if(!categorie){
        return next(new AppError("Categorie not found or already deleted", 404 ));
    }
    return res.status(200).json(categorie);
});
