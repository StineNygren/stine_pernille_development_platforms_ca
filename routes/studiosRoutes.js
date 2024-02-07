import express from "express";
import { getStudios } from "../controllers/studios/getStudiosController.js";

const router = express.Router();

router.get("/studio", getStudios);

export default router;
