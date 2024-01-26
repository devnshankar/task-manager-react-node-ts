import { prisma } from "../config/PrismaClient.config.js";
import { Request, Response } from "express";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import pkg from "lodash";
import { getCategoriesByUserId } from "./CategoryControllers.js";
const { omit } = pkg;
const JWT_SECRET: any = process.env.JWT_SECRET;

function generateHash(salt: string, password: string) {
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hashedPassword;
}

export function decodeJWTToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export const getUser = async (email:string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      categories: true,
      notifications: true,
    },
  });
  return existingUser;
}

export const getUserById = async (id:string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      categories: true,
      notifications: true,
    },
  });
  return existingUser;
}
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        success: false,
      });
    } else {
      const salt = randomBytes(32).toString("hex");
      const hashedPassword = generateHash(salt, password);
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          salt: salt,
          password: hashedPassword,
        },
      });
      res.status(201).json({
        message: "User Registered successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser !== null) {
      const hashedPassword = generateHash(existingUser!.salt, password);
      if (
        existingUser.email === email &&
        existingUser.password === hashedPassword
      ) {
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email },
          JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        const user = await getUser(email)
        const userWithoutSensitiveInfo = omit(user!, ["id", "password", "salt"]);
        const categories = await getCategoriesByUserId(user!.id)

        res.status(200).json({
          message: "User Logged in successfully",
          user: userWithoutSensitiveInfo,
          categories: categories,
          token: token,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "No such user exists with given credentials",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        message: "No such user exists with given credentials",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
