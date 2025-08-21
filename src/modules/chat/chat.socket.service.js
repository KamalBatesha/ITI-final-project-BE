import { ChatModel, connectionUser } from "../../DB/models/index.js";
import { authSocket } from "../../middleware/auth.js";

export const registerAccount = async (socket) => {
  let data = await authSocket(socket);
  if (data.statusCode != 200) {
    console.log("errorrrrrrrrrrrrrrrrrrrrr:", data);
    return socket.emit("authError", data);

  }
  console.log(connectionUser);
  connectionUser.set(data.user._id.toString(), socket.id);
  console.log(connectionUser);
  return "done";
}
export const logOut = async (socket) => {
  return socket.on("disconnect", async () => {
    console.log("disconnect");
    let data = await authSocket(socket);
    if (data.statusCode != 200) {
      console.log("errorrrrrrrrrrrrrrrrrrrrr:", data);
      return socket.emit("authError", data);

    }
    console.log(connectionUser);
    connectionUser.delete(data.user._id.toString());
    console.log(connectionUser);
  }

  )
}

export const sendMessage = async (socket) => {
  return socket.on("sendMessage", async ({ destinationId, message }) => {
    let data = await authSocket(socket);
    if (data.statusCode != 200) {
      console.log("errorrrrrrrrrrrrrrrrrrrrr:", data);
      return socket.emit("authError", data);
    }
    console.log({ destinationId, message });
    console.log(data);
    
    

    const userId = data.user._id;
    console.log(userId);
    
    let chat = await ChatModel.findOneAndUpdate(
      { $or: [
          { userId: destinationId, providerId: userId },
          { userId: userId, providerId: destinationId }
      ] },
      { $push: { messages: { content: message, senderId: userId } } },
      { new: true }
    );
    console.log(chat);
    

    if (!chat) {
      return socket.emit("messageError", { message: "There is no chat between you and this user" });
    }

    // الرسالة اللي لسه اتضافت
    const newMessage = chat.messages[chat.messages.length - 1];

    // ✅ رجّع للمرسل الرسالة الخاصة بيه
    socket.emit("messageSent", { message: newMessage, chat });

    // ✅ ابعتها للطرف الآخر
    const destSocketId = connectionUser.get(destinationId.toString());
    if (destSocketId) {
      socket.to(destSocketId).emit("receiveMessage", { message: newMessage, chat });
    }
  });
};
