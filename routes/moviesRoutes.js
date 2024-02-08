import express from "express";
import {
  postMovie,
  getMovies,
  deleteMovie,
} from "../controllers/MoviesController.js";

const router = express.Router();

router.post("/movie", postMovie);
router.get("/movie", getMovies);
router.delete("/movie/:movieId", deleteMovie);

export default router;
