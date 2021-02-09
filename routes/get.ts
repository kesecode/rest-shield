// Imports
import express from "express";
const router = express.Router();
// Local
import Helper from "../util/Helper";
const helper = new Helper();
import DatabaseManager from "../util/DatabaseManager";
import ServerLogger from "../util/ServerLogger";
const databaseManager = new DatabaseManager();
const log = ServerLogger.getChildLog();

router.get("/", (req: any, res: any) => {
  return res.send("Hello");
});

router.get("/coverage/firebaseChat", async (req: any, res: any, next: any) => {
  try {
    const doc = await databaseManager.getDocument("coverage", "FirebaseChat");
    if (!doc.exists) {
      return res.sendStatus(404);
    } else {
      res.json(
        helper.createResponse(helper.parseCoverage(JSON.stringify(doc.data())))
      );
    }
  } catch (error) {
    return next(error);
  }
});

export default router;
