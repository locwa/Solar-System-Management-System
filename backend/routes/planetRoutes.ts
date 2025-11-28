import express from "express";
import Planet from "../models/Planet";
import { requireLogin, requireRole } from "../middleware/Auth";

const router = express.Router();

// CREATE
router.post("/", requireRole("GALACTIC_LEADER"), async (req, res) => {
  const planet = await Planet.create(req.body);
  res.json(planet);
});

// LIST
router.get("/", async (req, res) => {
  const planets = await Planet.findAll();
  res.json(planets);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  res.json(planet);
});

// UPDATE
router.put("/:id", requireRole("GALACTIC_LEADER"), async (req, res) => {
  await Planet.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Planet updated" });
});

// DELETE
router.delete("/:id", requireRole("GALACTIC_LEADER"), async (req, res) => {
  await Planet.destroy({ where: { id: req.params.id } });
  res.json({ message: "Planet deleted" });
});

export default router;
