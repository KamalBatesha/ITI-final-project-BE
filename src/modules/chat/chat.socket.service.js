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
  return socket.on("sendMessage",async ({ destinationId, message }) => {
    
    let data = await authSocket(socket);
    if (data.statusCode != 200) {
      console.log("errorrrrrrrrrrrrrrrrrrrrr:", data);
      return socket.emit("authError", data);

    }
    const userId=data.user._id
    let chat;
    chat=await ChatModel.findOneAndUpdate({$or:[{userId:destinationId,providerId:userId},{userId:userId,providerId:destinationId}]},{$push:{messages:{content:message,senderId:userId}}},{new:true})
    if(!chat){
      return socket.emit("messageError", { message: "tere is no chat between you and this user" });
    }
     socket.to(connectionUser.get(userId.toString())).emit("messageSent", { message,chat});
     socket.to(connectionUser.get(destinationId.toString())).emit("receiveMessage", { message,chat});
  })
}