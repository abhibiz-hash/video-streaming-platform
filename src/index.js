import express from "express"
import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config()

const PORT = process.env.PORT


connectDB()
.then(()=>{
    app.listen(PORT || 8000, ()=>{
        console.log(`Server is running at port: ${PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed!!!!", error)
})

//connection within the running file
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("ERROR: ", error)
//             throw error
//         })
//         app.listen(process.env.PORT || 8000, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.log(error)
//     }

// })()