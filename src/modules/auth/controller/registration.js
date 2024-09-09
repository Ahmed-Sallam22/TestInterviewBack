import { compare, hash } from "../../../utils/HashAndCompare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import {
    generateToken,
    verifyToken,
  } from "../../../utils/GenerateAndVerifyToken.js";

import userModel from "../../../../DB/model/User.model.js";

export const signup=asyncHandler(
    async(req,res,next)=>{
    const {userName,pass,role}=req.body

     if (await userModel.findOne({ userName })) {
    return next(new Error(`!userName is Already Exist`, { cause: 409 }));
  }
  




    const HashPassword = hash({ plaintext: pass });
  
    const user = await userModel
      .create({
        userName,
        pass: HashPassword,
        role,
      });

  

      const userData = await userModel
      .findById(user._id)
      .select({ pass:0,token:0});
    


      return res.status(201).json({ Status: true, cause: 201, message: "Success", data: userData });  
  

}
)





export const login = asyncHandler(async (req, res, next) => {
  const { userName , pass } = req.body;
  const user = await userModel.findOne({ userName }).select('+pass'); // Ensure the password is included in the query
  
    if (!user) {
    return next(new Error("No Account with This userName", { cause: 404 }));
  }
  console.log(user);
  
  

  if (!compare({ plaintext: pass, hashValue: user.pass })) {
    return next(new Error("in-Valid Password , userName", { cause: 404 }));
  }


  const access_token = generateToken({
    payload: { _id: user._id, role: user.role },
    expiresIn: 60*30,
});

user.token = access_token;

await user.save();


  const userData = await userModel
  .findById(user._id)
  .select({ pass:0});


  return res
    .status(200)
    .json({Status:true ,cause:201, message: "Success", data: userData });
});


export const logout = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(process.env.BEARER_KEY)) {
      return res.status(401).json({ message: "Invalid bearer key" });
  }

  const token = authorization.split(process.env.BEARER_KEY)[1].trim();

  if (!token) {
      return res.status(401).json({ message: "Token not provided" });
  }

  try {
      const decoded = verifyToken({ token, signature: process.env.TOKEN_SIGNATURE });
      const user = await userModel.findById(decoded._id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Clear tokens
      user.token = null;
      await user.save();

      res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.error("Logout error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

if (!authorization || !authorization.startsWith(process.env.BEARER_KEY)) {
  return res.status(401).json({ message: "Invalid bearer key" });
}

const token = authorization.split(process.env.BEARER_KEY)[1].trim();
if (!token) {
  return res.status(401).json({ message: "Token not provided" });
}

  try {
    const decoded = verifyToken({ token, signature: process.env.TOKEN_SIGNATURE });
    const user = await userModel.findById(decoded._id);




      const newRefreshToken = generateToken({
          payload: { _id: user._id, role: user.role },
          expiresIn: 60 * 60 * 24 * 365
      });

      user.token = newRefreshToken;
      await user.save();

      return res.status(200).json({
          Status: true,
          cause: 200,
          message: "Tokens refreshed successfully",
          token: newRefreshToken,
      });
  } catch (error) {
      console.error("Refresh token error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
});







