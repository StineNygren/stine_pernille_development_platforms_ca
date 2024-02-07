import { connectDatabase, closeDatabase } from "../../db.js";

export const getCharacters = async (req, res) => {
  try {
    const database = await connectDatabase();
    const charactersCollection = database.collection("characters");

    const characters = await charactersCollection.find({}).toArray();

    if (!characters) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.send(characters);
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
