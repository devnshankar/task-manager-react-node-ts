import { Request, Response } from "express";
import { decodeJWTToken, getUserById } from "./UserControllers.js";
import jwt from "jsonwebtoken";
import { prisma } from "../config/PrismaClient.config.js";
import pkg from "lodash";
const { omit } = pkg;

export const getCategoryById = async (categoryId: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      tasks: true
    },
  });
  return existingCategory;
};
export const getCategoriesByUserId = async (userId: string) => {
  const existingCategory = await prisma.category.findMany({
    where: {
      userId: userId,
    },
    include: {
      tasks: true
    },
  });
  return existingCategory;
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;
    await prisma.category.create({
      data: {
        title,
        description,
        userId,
      },
    });
    const user = await getUserById(userId);
    const userWithoutSensitiveInfo = omit(user!, ["id", "password", "salt"]);

    res
      .status(201)
      .json({ message: "Category created successfully",user: userWithoutSensitiveInfo, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, userId } = req.body;
    await prisma.category.delete({
      where: { id: categoryId },
    });
    const user = await getUserById(userId);
    const userWithoutSensitiveInfo = omit(user!, ["id", "password", "salt"]);

    res
      .status(200)
      .json({
        message: "Category deleted successfully",
        user: userWithoutSensitiveInfo,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
