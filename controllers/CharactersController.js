import { connectDatabase, closeDatabase } from "../db.js";
import { ObjectId } from "mongodb";

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

      for (const newMovie of movie) {
        await database
          .collection("movies")
          .updateOne(
            { title: newMovie },
            { $push: { characters: name } },
            { session }
          );
      }

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


    const session = database.client.startSession();
    session.startTransaction();

    try {
      await database.collection("characters").deleteOne(query, { session });

      for (const movie of character.movie) {
        await database
          .collection("movies")
          .updateOne(
            { title: movie },
            { $pull: { characters: character.name } },
            { session }
          );
      }

      await session.commitTransaction();

      res.json({ message: "Character successfully deleted" });
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

    const session = database.client.startSession();
    session.startTransaction();

    try {
      await charactersCollection.updateOne(
        query,
        { $set: { name, movie, main, gender, species } },
        { session }
      );


      await database
        .collection("movies")
        .updateMany(
          { characters: character.name },
          { $pull: { characters: character.name } },
          { session }
        );

      for (const newMovie of movie) {
        await database
          .collection("movies")
          .updateOne(
            { title: newMovie },
            { $addToSet: { characters: name } },
            { session }
          );
      }

      await session.commitTransaction();

      res.json({ message: "Character successfully updated" });
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
