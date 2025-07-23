import express from 'express';
import bootstrap from './src/app.controller.js';
import { runIo } from './src/modules/chat/chat.socket.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
const app = express()
const port = process.env.PORT || 3001

bootstrap(app,express)

let httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
runIo(httpServer)