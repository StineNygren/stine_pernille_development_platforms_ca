import { connectDatabase, closeDatabase } from "../../db.js";

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
      .updateOne(
        { name: studio },
        { $push: { movies: movie.title } },
        { session }
      );

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
