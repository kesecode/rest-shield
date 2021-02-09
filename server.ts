// Imports
import express from "express";
import config from "./config/rest-shield-config.json";
import ServerLogger from "./util/ServerLogger";
const log = ServerLogger.getChildLog();

//Routes
import postRoutes from "./routes/post";
import getRoutes from "./routes/get";
import auth from "./routes/auth";

const PORT = config.port;
const api = express();

api.listen(PORT, () => {
  log.info("API LISTENING @", PORT);
});

api.use("/api/post", postRoutes);
api.use("/api/get", getRoutes);
api.use("/api/auth", auth);
