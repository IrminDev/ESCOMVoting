package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.model.entity.*;
import com.github.escom.escomvoting.repository.BallotRepository;
import com.github.escom.escomvoting.repository.CandidateRepository;
import com.github.escom.escomvoting.repository.ElectionResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.*;

@Service
public class TallyService {

    private static final MathContext MC = MathContext.DECIMAL128;

    private final BallotRepository ballotRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionResultRepository resultRepository;
    private final ElectionService electionService;

    public TallyService(BallotRepository ballotRepository,
                        CandidateRepository candidateRepository,
                        ElectionResultRepository resultRepository,
                        ElectionService electionService) {
        this.ballotRepository = ballotRepository;
        this.candidateRepository = candidateRepository;
        this.resultRepository = resultRepository;
        this.electionService = electionService;
    }

    @Transactional
    public void tally(UUID electionId) {
        Election election = electionService.findOrThrow(electionId);
        List<Candidate> candidates = candidateRepository.findAllByElectionIdOrderByPositionAsc(electionId);

        // Find groups that actually cast votes
        List<UserRole> participatingGroups = Arrays.stream(UserRole.values())
                .filter(group -> ballotRepository.countByElectionIdAndGroup(electionId, group) > 0)
                .toList();

        if (participatingGroups.isEmpty()) {
            // No votes cast — store zero scores
            storeZeroResults(election, candidates);
            return;
        }

        // weight_per_group = 1 / |participating_groups| (redistributes absent groups)
        BigDecimal groupWeight = BigDecimal.ONE
                .divide(BigDecimal.valueOf(participatingGroups.size()), MC);

        // Precompute total votes per participating group
        Map<UserRole, Long> groupTotals = new EnumMap<>(UserRole.class);
        for (UserRole group : participatingGroups) {
            groupTotals.put(group, ballotRepository.countByElectionIdAndGroup(electionId, group));
        }

        // Wipe old results if re-tallying
        resultRepository.deleteAllByElectionId(electionId);

        for (Candidate candidate : candidates) {
            int totalVotes = 0;
            BigDecimal weightedScore = BigDecimal.ZERO;

            for (UserRole group : participatingGroups) {
                long groupVotesForCandidate = ballotRepository
                        .countByElectionIdAndCandidateIdAndGroup(electionId, candidate.getId(), group);
                long groupTotal = groupTotals.get(group);
                totalVotes += (int) groupVotesForCandidate;

                // fraction = votes_for_candidate_in_group / total_votes_in_group
                BigDecimal fraction = BigDecimal.valueOf(groupVotesForCandidate)
                        .divide(BigDecimal.valueOf(groupTotal), MC);
                weightedScore = weightedScore.add(fraction.multiply(groupWeight, MC), MC);
            }

            ElectionResult result = new ElectionResult();
            result.setElection(election);
            result.setCandidate(candidate);
            result.setVoteCount(totalVotes);
            result.setWeightedScore(weightedScore);
            resultRepository.save(result);
        }
    }

    private void storeZeroResults(Election election, List<Candidate> candidates) {
        resultRepository.deleteAllByElectionId(election.getId());
        for (Candidate candidate : candidates) {
            ElectionResult result = new ElectionResult();
            result.setElection(election);
            result.setCandidate(candidate);
            result.setVoteCount(0);
            result.setWeightedScore(BigDecimal.ZERO);
            resultRepository.save(result);
        }
    }
}
