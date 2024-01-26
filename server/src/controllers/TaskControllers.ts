import { prisma } from "../config/PrismaClient.config.js";
import { Request, Response } from "express";
import { getUserById } from "./UserControllers.js";
import pkg from "lodash";
import { getCategoriesByUserId, getCategoryById } from "./CategoryControllers.js";
const { omit } = pkg;

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, categoryId, deadline, priority, userId } = req.body;
    await prisma.task.create({
      data: {
        title,
        description,
        categoryId,
        deadline,
        priority
      },
    });
    const category = await getCategoryById(categoryId);
    const categoryWithoutSensitiveInfo = omit(category!, ["userId"]);
    res.status(201).json({
      message: "Task created successfully",
      category: categoryWithoutSensitiveInfo,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id, userId} = req.body;
    await prisma.task.delete({
      where: {
        id
      },
    });
    const categories = await getCategoriesByUserId(userId);
    res.status(200).json({
      message: "Task deleted successfully",
      categories: categories,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
      const { userId, status, title, description, taskId, deadline, priority} = req.body;

      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          title: title!,
          description: description!,
          deadline: deadline!,
          priority: priority!,
          status: status
        }
      });
      const categories = await getCategoriesByUserId(userId);

      res.status(201).json({
        message: "Task updated successfully",
        categories: categories,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
};
