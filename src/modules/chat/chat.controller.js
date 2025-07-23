import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import * as CS from "./chat.service.js"
import * as CV from "./chat.validation.js"
import { validation } from "../../middleware/validation.js";










const chatRouter=Router()
chatRouter.get('/',validation(CV.getMyChatsSchema),authentication,CS.getMyChats)
chatRouter.get('/:id',validation(CV.getChatByIdSchema),authentication,CS.getChatById)


export default chatRouter


// import { Router } from "express";
// import { sendMessageSchema } from "./chat.validation.js";
// import {
//   findOrCreateChat,
//   addMessageToChat,
//   getUserChats,
//   getProviderChats,
// } from "./chat.service.js";
// import { multerHost } from "../../middleware/multer.js";
// import { authentication } from "../../middleware/auth.js";
// import { asyncHandler } from "../../utils/globalErrorHandling/index.js";
// import { generalRuls } from "../../utils/generalRules/index.js";
// import { validation } from "../../middleware/validation.js";
// import { ChatModel } from "../../DB/models/chat.model.js";

// const router = Router();

// const upload = multerHost(generalRuls.image, "Only images allowed").fields([
//   { name: "image", maxCount: 1 },
// ]);

// router.post(
//   "/send",
//   upload,
//   authentication,
// //   validation(sendMessageSchema),
//   asyncHandler(async (req, res, next) => {
//     const { userId, providerId, text, chatId } = req.body;
//     const senderId = req.user._id;

//     let chat;
//     if (chatId) {
//       chat = await ChatModel.findById(chatId);
//     } else {
//       chat = await findOrCreateChat(userId, providerId);
//     }

//     if (!chat) return res.status(404).json({ message: "Chat not found" });

//     let image = null;
//     if (req.files?.image?.length) {
//       const uploaded = await uploadImage(req.files.image[0].path, "chatImages");
//       image = {
//         secure_url: uploaded.secure_url,
//         public_id: uploaded.public_id,
//       };
//     }

//     const message = {
//       text,
//       image,
//       senderId,
//     };

//     const updatedChat = await addMessageToChat(chat._id, message);

//     req.io?.to(chat._id.toString()).emit("receiveMessage", {
//       chatId: chat._id,
//       message,
//     });

//     res.status(201).json({ chatId: chat._id, message });
//   })
// );

// router.get(
//   "/myChats",
//   authentication,
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const userChats = await getUserChats(userId);
//     res.status(200).json({ chats: userChats });
//   })
// );

// router.get(
//   "/providerChats",
//   authentication,
//   asyncHandler(async (req, res) => {
//     const providerId = req.user._id;
//     const providerChats = await getProviderChats(providerId);
//     res.status(200).json({ chats: providerChats });
//   })
// );

// export default router;
