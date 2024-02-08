import { connectDatabase, closeDatabase } from "../../db.js";
import { ObjectId } from "mongodb";

export const deleteCharacter = async (req, res) => {
  try {
    const database = await connectDatabase();
    const charactersCollection = database.collection("characters");

    const characterId = new ObjectId(req.params.characterId);
    const query = { _id: characterId };
    const character = await charactersCollection.findOne(query);

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    await database.collection("characters").deleteOne(character);

    await database
      .collection("movies")
      .updateOne(
        { title: character.movie },
        { $pull: { characters: character.name } }
      );

    res.json({ message: "Character successfully deleted" });
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
