import mongoose from "mongoose";
import { CategoryModel } from "../../DB/models/index.js";
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
    const categories = await CategoryModel.find({deletedBy:{$exists:false}});
    if(categories.length==0){
        return next(new AppError("there is no categories yet or deleted", 404 ));
    }
    return res.status(200).json(categories);
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
