import { Request, Response, NextFunction } from 'express';
import { decodeJWTToken } from '../controllers/UserControllers.js';
import * as jwt from "jsonwebtoken"; 

const auth = async (req:Request, res:Response, next:NextFunction) => {
  try {
    let token = req.headers.authorization
    if(token){
      token = token.split(" ")[1];
      let decodedToken = decodeJWTToken(token as string) as jwt.JwtPayload;
      if (decodedToken) {
        req.body = { ...req.body, userId: decodedToken.id };
        next();
      } else {
        res.status(401).json({ message: "Unauthorized User", success: false });
      }
    }
    else{
      res.status(401).json({message: "Unauthorized User", success: false})
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User", success: false });
  }
};

export default auth