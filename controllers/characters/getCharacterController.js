import { connectDatabase, closeDatabase } from "../../db.js";
import { ObjectId } from "mongodb";

export const getCharacter = async (req, res) => {
  try {
    const database = await connectDatabase();
    const charactersCollection = database.collection("characters");

    const characterId = new ObjectId(req.params.characterId);
    const query = { _id: characterId };

    const character = await charactersCollection.findOne(query);

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.send(character);
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
