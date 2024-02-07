import express from "express";
import { connectDatabase, closeDatabase } from "./db.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import characterRoutes from "./routes/charactersRoutes.js";
import studiosRoutes from "./routes/studiosRoutes.js";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

async function run() {
  try {
    const db = await connectDatabase("admin");
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  } finally {
    await closeDatabase();
  }
}
run().catch(console.dir);

app.use("/movies", moviesRoutes);
app.use("/characters", characterRoutes);
app.use("/studios", studiosRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
