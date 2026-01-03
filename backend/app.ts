import dotenv from "dotenv";
// Load environment variables BEFORE other imports that depend on them
dotenv.config({ path: process.env.NODE_ENV === "development" ? ".env.development" : ".env" });

import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import gameRouter from "./routes/gameRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

const CORS_OPTIONS = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204,
    allowHeaders: [
        "Content-Type",
        "Authorization"
    ]
};


// Middleware
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).send("API is running...");
});
app.use( "/api/v1/auth", userRouter );
app.use( "/api/v1", gameRouter );

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});