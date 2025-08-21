import { Server } from "socket.io";
import { authSocket } from "../../middleware/auth.js";
import {registerAccount,logOut, sendMessage} from "./chat.socket.service.js"

export const runIo = async (httpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: '*' },
    });

    io.on('connection', async (socket) => {
        console.log('🔌 A user connected:', socket.id);
        console.log('🔌 A user connected2:', socket.handshake.auth);

         await registerAccount(socket);
        await logOut(socket);
        await sendMessage(socket);

        // socket.on('joinRoom', ({ chatId }) => {
        //   socket.join(chatId);
        // });

        // socket.on('sendMessage', ({ chatId, message }) => {
        //   io.to(chatId).emit('receiveMessage', message);
        // });

        // socket.on('disconnect', () => {
        //   console.log('❌ User disconnected:', socket.id);
        // });
    });
}




// ===== index.js =====
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import bootstrap from './src/app.controller.js';
// import cors from 'cors'; // ✅ أضف هذا السطر
// import { registerAccount } from './chat.service';


// const app = express();
// app.use(cors({ origin: "*", credentials: true }));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: { origin: '*' },
// });

// // Make io available in all requests
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Bootstrap express routes and DB
// bootstrap(app, express);

// // Socket.IO Events
// io.on('connection', (socket) => {
//   console.log('🔌 A user connected:', socket.id);

//   socket.on('joinRoom', ({ chatId }) => {
//     socket.join(chatId);
//   });

//   socket.on('sendMessage', ({ chatId, message }) => {
//     io.to(chatId).emit('receiveMessage', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('❌ User disconnected:', socket.id);
//   });
// });

// const port = process.env.PORT || 3000;
// httpServer.listen(port, () => {
//   console.log(`🚀 Server with WebSocket listening on port ${port}`);
// });
