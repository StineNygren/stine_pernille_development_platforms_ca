import { connectDatabase, closeDatabase } from "../../db.js";

export const getMovies = async (req, res) => {
  try {
    const database = await connectDatabase();
    const moviesCollection = database.collection("movies");

    const movies = await moviesCollection.find({}).toArray();

    if (!movies) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.send(movies);
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
