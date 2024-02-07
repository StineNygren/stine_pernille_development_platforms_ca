import { connectDatabase, closeDatabase } from "../../db.js";
import { ObjectId } from "mongodb";

export const deleteMovie = async (req, res) => {
  try {
    const database = await connectDatabase();
    const moviesCollection = database.collection("movies");

    const movieId = new ObjectId(req.params.movieId);
    const query = { _id: movieId };
    const movie = await moviesCollection.findOne(query);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await database.collection("movies").deleteOne(movie);

    await database
      .collection("studios")
      .updateMany({ movies: movie.title }, { $pull: { movies: movie.title } });

    res.json({ message: "Movie successfully deleted" });
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
