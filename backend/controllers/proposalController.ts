import { Request, Response } from 'express';
import PlanetProposal from '../models/PlanetProposal';
import Planet from '../models/Planet';
import User from '../models/User';
import Vote from '../models/Vote';
import PlanetaryLeader from '../models/PlanetaryLeader';
import Citizen from '../models/Citizen';

// Submit a new modification request (initiates a vote) (Planetary Leader only)
export const submitModificationRequest = async (req: Request, res: Response) => {
  try {
    const { planetId } = req.params;
    const { title, description } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can submit modification requests' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: parseInt(planetId),
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
    }

    const planet = await Planet.findByPk(parseInt(planetId));
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    const proposal = await PlanetProposal.create({
      PlanetID: parseInt(planetId),
      ProposerID: userId,
      Title: title,
      Description: description,
      Status: 'Pending',
      ProposedDate: new Date(),
    });

    res.status(201).json(proposal);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// View details of a specific modification request before voting (Citizen only)
export const getModificationRequestDetails = async (req: Request, res: Response) => {
  try {
    const { planetId, requestId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view modification request details' });
    }

    const citizen = await Citizen.findOne({
      where: {
        UserID: userId, // Corrected to UserID
        PlanetID: parseInt(planetId),
      },
    });

    if (!citizen) {
      return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
    }

    const proposal = await PlanetProposal.findOne({
      where: {
        ProposalID: parseInt(requestId),
        PlanetID: parseInt(planetId),
      },
      include: [
        { model: Planet, as: 'Planet' },
        { model: User, as: 'Proposer' },
      ],
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Modification request not found' });
    }

    res.json(proposal);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Cast a vote (For/Against) on the pending request (Citizen only)
export const castVoteOnRequest = async (req: Request, res: Response) => {
  try {
    const { planetId, requestId } = req.params;
    const { voteType } = req.body; // 'For' or 'Against'
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can cast votes' });
    }

    const citizen = await Citizen.findOne({
      where: {
        UserID: userId, // Corrected to UserID
        PlanetID: parseInt(planetId),
      },
    });

    if (!citizen) {
      return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
    }

    const proposal = await PlanetProposal.findOne({
      where: {
        ProposalID: parseInt(requestId),
        PlanetID: parseInt(planetId),
        Status: 'Pending', // Only allow voting on pending proposals
      },
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Pending modification request not found' });
    }

    // Check if the citizen has already voted on this proposal
    const existingVote = await Vote.findOne({
      where: {
        ProposalID: parseInt(requestId),
        VoterID: userId,
      },
    });

    if (existingVote) {
      return res.status(409).json({ error: 'You have already voted on this proposal' });
    }

    if (!['For', 'Against'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type. Must be "For" or "Against"' });
    }

    await Vote.create({
      ProposalID: parseInt(requestId),
      VoterID: userId,
      VoteType: voteType,
    });

    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
