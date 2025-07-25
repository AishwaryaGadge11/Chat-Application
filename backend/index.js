const express = require("express");
const dotenv= require("dotenv")
const cors = require("cors")
const {server,app} = require("./src/lib/socket")
const path = require("path")
const __dirname = path.resolve();


app.use(express.json());

dotenv.config();
const authRoutes = require("./src/routes/auth.route");
const messageRoutes = require("./src/routes/message.route")
const { connectDB } = require("./src/lib/db");
const cookieParser = require("cookie-parser");
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
    
))
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}
server.listen(5001,()=>{
    console.log("server is running on 5001");
    connectDB()
})