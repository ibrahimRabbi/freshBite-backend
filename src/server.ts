import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { envData } from './app/config/config'
import { globalErrorHandler } from './app/middleware/globalError'
import { notFound } from './app/middleware/notFound'
import { router } from './app/router'
import { SubscriptionWillBeExpired } from './app/helper/subscriptionAutoExpired';
import http from 'http'
import { Server } from 'socket.io'
import { conversationController } from './app/modules/conversation/conversation.controller'



const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}))
app.use(express.json())
app.use('/api/v1', router)




async function main() {
  await mongoose.connect(envData.databaseUrl as string);

  SubscriptionWillBeExpired()


  io.on("connection", (socket) => {
    console.log('socket connect with server')

    conversationController(io,socket)
 
    socket.on("disconnect", async () => {
      console.log("A user disconnected");
    })

  })


    httpServer.listen(envData.port, () => {
      console.log(`server in running on ${envData.port}`)
    })
  }


app.use(globalErrorHandler)
app.use(notFound)


main()




//   try {
      //     if (userId) {
      //       await userModel.findByIdAndUpdate(
      //         userId,
      //         { isActive: false },
      //         { runValidators: true, context: "query" }
      //       );
      //     }
      //     console.log("A user disconnected:", userId);
      //   } catch (err) {
      //     console.error("Error on disconnect update:", err);
      //   }
      // });