import express, { Router } from "express";
import {
  showGames,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/gamesController";
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.get("/games", protect, showGames);
router.post("/favorites/:gameId", protect, addFavorite);
router.delete("/favorites/:gameId", protect, removeFavorite);
router.get("/favorites", protect, getFavorites);

export default router;
