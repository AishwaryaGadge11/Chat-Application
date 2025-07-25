const { cloudinary } = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");
const { Message } = require("../models/message.model");
const User = require("../models/user.model");

const getUsersForSidebar =async(req,res)=>{
try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    res.status(200).json(filteredUsers)
} catch (error) {
    console.log("error in getusersforsidebar",error.message);
    res.status(500).json({error:"Internal server error"})
    
}
}


const getMessages =async(req,res)=>{
try {
    //renaming the id
    const{id:userToChatId} =req.params
    //this is the same id from route
    const myId =req.user._id
    //id of currently loggedin user

    const messages = await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    })
    res.status(200).json(messages)
} catch (error) {
    console.log("error in message controller",error.message);
    res.status(500).json({message:"Internal server error"})
    
}
}

const sendMessage =async(req,res)=>{
    try {
        const {text,image}= req.body;
        const{id:receiverId}= req.params;
        const senderId= req.user._id;
        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,//us
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
     const receiverSocketId = getReceiverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
     }

      //todo:realtime functionality goes here =>socket.io  
      res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendmessage",error.message);
        res.status(500).json({error:"internal server error"})
        
    }
}
module.exports={getUsersForSidebar,getMessages,sendMessage}