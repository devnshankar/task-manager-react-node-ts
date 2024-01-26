import { Request, Response } from "express";

export const getNotifications = (req: Request, res: Response) => {
  const { userId } = req.body;
  res.json({ message: "Notifications sent successfully", data: { userId } });
};

export const createNotification = (req: Request, res: Response) => {
  const { userId } = req.body;
  res.json({ message: "Notification created successfully", data: { userId } });
};
