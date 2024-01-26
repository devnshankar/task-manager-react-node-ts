import express from "express";
import {
  createCategory,
  deleteCategory,
} from "../controllers/CategoryControllers.js";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/TaskControllers.js";
import { login, signup } from "../controllers/UserControllers.js";
import auth from "./Auth.middleware.js";
import cors from "cors";

export function ServerInitializer(app: express.Express) {
  try {
    app.listen(process.env.PORT || 3001, () =>
      console.log("REST API server ready at: http://localhost:3000")
    );
    app.use(express.json());

    const corsOptions = {
      origin: [`${process.env.CLIENT_URL}`],
      credentials: true,
      methods: "POST, PUT, OPTIONS, DELETE, GET",
      allowedHeaders: "X-Requested-With, Content-Type, Authorization",
    };
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));
    // CORS
    app.use(function (req, res, next) {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, PUT, OPTIONS, DELETE, GET"
      );
      res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    app.get("/", (req, res) => {
      res.send("Hello, this is the root!");
    });

    app.post("/users/signup", signup);
    app.post("/users/login", login);

    app.post("/users/categories", auth, createCategory);
    app.delete("/users/categories", auth, deleteCategory);

    app.post("/users/tasks", auth, createTask);
    app.put("/users/tasks", auth, updateTask);
    app.delete("/users/tasks", auth, deleteTask);
  } catch (error) {
    console.log(error);
  }
}
