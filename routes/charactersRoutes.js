import express from "express";
import { addCharacter } from "../controllers/characters/addCharacterController.js";
import { deleteCharacter } from "../controllers/characters/deleteCharacterController.js";
import { getCharacters } from "../controllers/characters/getCharactersController.js";
import { editCharacter } from "../controllers/characters/editCharacterController.js";
import { getCharacter } from "../controllers/characters/getCharacterController.js";

const router = express.Router();

router.post("/character", addCharacter);
router.delete("/character/:characterId", deleteCharacter);
router.get("/characters", getCharacters);
router.put("/character/:characterId", editCharacter);
router.get("/character/:characterId", getCharacter);

export default router;
