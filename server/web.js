const express=require("express")
const Router=express.Router();
const { registerController,loginController} =require("./Controller/users.js")
Router.post("/login",loginController)
Router.post("/register",registerController)

module.exports=Router;