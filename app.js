import express from "express";
import { connectDatabase, closeDatabase } from "./db.js";

const app = express();
app.use(express.json());

connectDatabase();
