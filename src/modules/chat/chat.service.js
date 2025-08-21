import { ChatModel } from "../../DB/models/index.js";
import { asyncHandler } from "../../utils/globalErrorHandling/index.js";
import { AppError } from './../../utils/globalErrorHandling/index.js';

export const getMyChats=asyncHandler(async(req,res,next)=>{
    const userChats=await ChatModel.find({$or:[{userId:req.user._id},{providerId:req.user._id}]}).populate("userId").populate("providerId").select("userId providerId");
    res.status(200).json(userChats);
})

export const getChatById =asyncHandler(async(req,res,next)=>{
    const chat=await ChatModel.findById(req.params.id).populate([
        {path:"userId"},
        {path:"providerId"},
        // {path:"messages.senderId",select:"firstName lastName userName"},
    ]);
    if(!chat){
        return next(new AppError("chat not found",404));
    }
    if(chat.userId._id.toString()!==req.user._id.toString() && chat.providerId._id.toString()!==req.user._id.toString() && req.user.role!=="admin"){
        console.log(chat);
        console.log(req.user);
        return next(new AppError("you are not the owner of this chat or admin",403));
    }
    res.status(200).json(chat);
})