import express from "express";
import { getBggSearch, getBggVersions, getGameInfo } from "../controllers/bggProxyController.js";

const router = express.Router();

router.get("/search", getBggSearch);
router.get("/versions", getBggVersions);
router.get("/game-info/", getGameInfo);

export default router;
