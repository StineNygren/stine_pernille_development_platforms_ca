import { connectDatabase, closeDatabase } from "../../db.js";
import { ObjectId } from "mongodb";

export const editCharacter = async (req, res) => {
  try {
    const database = await connectDatabase();
    const charactersCollection = database.collection("characters");
    const characterId = new ObjectId(req.params.characterId);
    const query = { _id: characterId };
    const { name, movie, main, gender, species } = req.body;

    const character = await charactersCollection.findOne(query);

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    await database
      .collection("characters")
      .updateOne(character, { $set: { name, movie, main, gender, species } });

    res.json({ message: "Character successfully updated" });
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
