import express from "express";
import { postMovie } from "../controllers/movies/postMovieController.js";
import { getMovies } from "../controllers/movies/getMoviesController.js";
import { deleteMovie } from "../controllers/movies/deleteMovieController.js";

const router = express.Router();

router.post("/movie", postMovie);
router.get("/movie", getMovies);
router.delete("/movie/:movieId", deleteMovie);

export default router;
