import express from "express";
import {
  addCharacter,
  deleteCharacter,
  getCharacters,
  editCharacter,
  getCharacter,
} from "../controllers/CharactersController.js";

const router = express.Router();

router.post("/character", addCharacter);
router.delete("/character/:characterId", deleteCharacter);
router.get("/characters", getCharacters);
router.put("/character/:characterId", editCharacter);
router.get("/character/:characterId", getCharacter);

export default router;
