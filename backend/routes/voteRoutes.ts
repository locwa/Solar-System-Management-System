import express from "express";
import Vote from "../models/Vote";
import { requireLogin, requireRole } from "../middleware/Auth";

const router = express.Router();

// CREATE vote
router.post("/", requireRole("CITIZEN"), async (req, res) => {
  const vote = await Vote.create({
    ...req.body,
    userId: req.session.user.id
  });
  res.json(vote);
});

// LIST votes
router.get("/", async (req, res) => {
  res.json(await Vote.findAll());
});

// GET votes by proposal
router.get("/proposal/:proposalId", async (req, res) => {
  res.json(await Vote.findAll({ where: { proposalId: req.params.proposalId } }));
});

// DELETE vote — user can delete only own vote
router.delete("/:id", requireLogin, async (req, res) => {
  const vote = await Vote.findByPk(req.params.id);

  if (!vote) return res.status(404).json({ message: "Vote not found" });
  if (vote.userId !== req.session.user.id) {
    return res.status(403).json({ message: "You can delete only your vote" });
  }

  await vote.destroy();
  res.json({ message: "Vote removed" });
});

export default router;
