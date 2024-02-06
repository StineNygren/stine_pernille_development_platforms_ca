import express from "express";
import { postMovie } from "../controllers/movies/postMovieController.js";

const router = express.Router();

router.post("/movie", postMovie);

export default router;
