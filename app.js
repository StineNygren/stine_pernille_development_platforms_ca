import express from "express";
import { connectDatabase, closeDatabase } from "./db.js";
import moviesRoutes from "./routes/moviesRoutes.js";

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
