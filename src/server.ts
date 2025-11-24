import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { envData } from './app/config/config'
import { globalErrorHandler } from './app/middleware/globalError'
import { notFound } from './app/middleware/notFound'
import { router } from './app/router'
import { SubscriptionWillBeExpired } from './app/helper/subscriptionAutoExpired';

const app = express()



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

  app.listen(envData.port, () => {
    console.log(`server in running on ${envData.port}`)
  }) 
}


app.use(globalErrorHandler)
app.use(notFound)


main()