import { connectDatabase, closeDatabase } from "../../db.js";

export const addCharacter = async (req, res) => {
  try {
    const database = await connectDatabase();

    const { name, movie, main, gender, species } = req.body;

    if (!name || !movie || !main || !gender || !species) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const session = database.client.startSession();
    session.startTransaction();

    try {
      const character = await database
        .collection("characters")
        .insertOne({ name, movie, main, gender, species }, { session });

      await database
        .collection("movies")
        .updateOne(
          { title: movie },
          { $push: { characters: name } },
          { session }
        );

      await session.commitTransaction();
      session.endSession();
      res.status(201).json(character.insertedId);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
