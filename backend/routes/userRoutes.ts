import express, { Router } from "express";
import { registerUser } from "../controllers/userController";
import { loginUser } from "../controllers/userController";
const router: Router = express.Router();
router.route( "/register" ).post( registerUser );
router.route( "/login" ).post( loginUser );
export default router;
