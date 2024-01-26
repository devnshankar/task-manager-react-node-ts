import { Request, Response } from "express";

export const getSubtasks = (req: Request, res: Response) => {
  const { userId } = req.body;
  res.json({ message: "Subtasks sent successfully", data: { userId } });
};

export const createSubtask = (req: Request, res: Response) => {
  const { userId } = req.body;
  res.json({ message: "Subtask created successfully", data: { userId } });
};
