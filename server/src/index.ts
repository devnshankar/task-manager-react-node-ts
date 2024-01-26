// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { nodeClusterizer } from "./middlewares/NodeClusterizer.middleware.js";
import { ServerInitializer } from "./middlewares/ServerInitializer.middleware.js";

async function main() {
  const app = express();
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))
  dotenv.config();
  ServerInitializer(app);
}

// nodeClusterizer(main);
main();
