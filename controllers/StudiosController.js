import { connectDatabase, closeDatabase } from "../db.js";

export const getStudios = async (req, res) => {
  try {
    const database = await connectDatabase();
    const studiosCollection = database.collection("studios");

    const studios = await studiosCollection.find({}).toArray();

    if (!studios) {
      return res.status(404).json({ message: "Studio not found" });
    }

    res.send(studios);
  } catch (error) {
    res.json(error);
  } finally {
    await closeDatabase();
  }
};
