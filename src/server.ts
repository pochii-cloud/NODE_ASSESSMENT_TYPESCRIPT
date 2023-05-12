import express  from "express";
import { router } from "./Routes/userRoutes";
const app=express()
app.use(express.json())



app.use('/users',router)

app.listen(5000,()=>{
    console.log('server running')
})