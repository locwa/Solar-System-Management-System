import express from "express";
import Proposal from "../models/Proposal";
import { requireLogin, requireRole } from "../middleware/Auth";

const router = express.Router();

// CREATE proposal — Citizens allowed
router.post("/", requireLogin, async (req, res) => {
  const proposal = await Proposal.create({
    ...req.body,
    creatorId: req.session.user.id
  });
  res.json(proposal);
});

// LIST proposals
router.get("/", async (req, res) => {
  res.json(await Proposal.findAll());
});

// GET ONE
router.get("/:id", async (req, res) => {
  res.json(await Proposal.findByPk(req.params.id));
});

// UPDATE (Planet Leaders + Galactic Leaders)
router.put("/:id", requireRole("PLANET_LEADER", "GALACTIC_LEADER"), async (req, res) => {
  await Proposal.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Proposal updated" });
});

// DELETE (Galactic Leaders only)
router.delete("/:id", requireRole("GALACTIC_LEADER"), async (req, res) => {
  await Proposal.destroy({ where: { id: req.params.id } });
  res.json({ message: "Proposal deleted" });
});

export default router;
