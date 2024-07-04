const express=require("express")
const UserModel =require("../schema/userModel.js")
const generateToken=require("../Config/generateToken.js")


const loginController=async(req,res)=>{
  const {fname,password}=req.body;
  console.log(req.body)
  const user=await UserModel.findOne({fname});

  if(user &&(await user.matchPassword(password)))                                                         
  {
    //*******************
   const response = {
      _id: user._id,
      fname: user.fname,
      email: user.email,
      token: generateToken(user._id),
    };
    console.log(response);
    res.json(response);
    //**********************
  }else{
    //****************
     res.status(401);
    throw new Error("Invalid UserName or Password");
    //******************
  }
}







const registerController=async (req,res)=>{
  const {fname,lname,email,password}=req.body;
  console.log(req.body)
  // ****************
  if (!fname || !email || !password) {
    res.send(400);
    throw Error("All necessary input fields have not been filled");
  }
  //******************
  //*****************
 // pre-existing user
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    // res.send(405);
    throw new Error("User already Exists");
  }
    // userName already Taken
    //***************
  //****************
 // create an entry in the db
  const user = await UserModel.create({ fname,lname, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      fname: user.name,
      lname:user.lname,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
  //********************
}

module.exports={registerController,loginController}