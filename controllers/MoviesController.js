import { connectDatabase, closeDatabase } from "../db.js";
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

    const session = database.client.startSession();
    session.startTransaction();

    try {
      await database.collection("movies").deleteOne(query, { session });

      await database
        .collection("studios")
        .updateMany(
          { movies: movie.title },
          { $pull: { movies: movie.title } },
          { session }
        );

      await session.commitTransaction();
      res.json({ message: "Movie successfully deleted" });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};

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

export const postMovie = async (req, res) => {
  const database = await connectDatabase();

  const { title, releaseYear, characters, studio, description } = req.body;

  if (!title || !releaseYear || !characters || !studio || !description) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const session = database.client.startSession();
  session.startTransaction();

  try {
    const releaseDate = new Date(releaseYear);
    const movie = await database.collection("movies").insertOne(
      {
        title,
        releaseYear: releaseDate,
        characters,
        studio,
        description,
      },
      { session }
    );

    await database
      .collection("studios")
      .updateOne({ name: studio }, { $push: { movies: title } }, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ movie });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    await closeDatabase();
  }
};
