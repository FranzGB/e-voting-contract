// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BallotContract {
    //VARIABLES
    struct VotingProposal {
        address creatorAddress;
        uint256 proposalId;
        string officialName;
        string description;
        uint256 createdAt;
        State status;
    }

    struct Vote {
        uint256 proposalId; //This id refers to the proposal
        bool choice; //Support or not
    }

    struct HelperCounter {
        uint256 totalVotesInFavor;
        uint256 totalRegisteredVoters;
        uint256 totalVotesCast;
    }

    enum State {
        Created,
        Voting,
        Ended
    }

    uint256 public proposalCounter = 0;

    //MAPPINGS

    mapping(uint256 => uint256) private countResult;
    mapping(uint256 => HelperCounter) public helperCounters; //uint256 ProposalId
    mapping(address => string) public voterNames;
    mapping(uint256 => mapping(uint256 => Vote)) private votes;
    // A proposal id is the key for the vote counter that maps a vote, this is private so in theory is not accessible.
    mapping(address => mapping(uint256 => bool)) public voterRegistry;
    mapping(uint256 => VotingProposal) public proposals;

    //MODIFIERS
    modifier onlyOfficial(uint256 _id) {
        VotingProposal memory _proposal = proposals[_id];
        require(
            _proposal.creatorAddress == msg.sender,
            "Error: You are not the official who created this proposal. Only the official can call this function"
        );
        _;
    }

    modifier inState(State _state, uint256 _id) {
        VotingProposal memory _proposal = proposals[_id];
        require(
            _proposal.status == _state,
            "Error: The proposal is not in the state required to perform this action"
        );
        _;
    }

    modifier hasNotVoted(uint256 _id) {
        VotingProposal memory _proposal = proposals[_id];
        require(
            bytes(voterNames[msg.sender]).length != 0 &&
                !voterRegistry[msg.sender][_id],
            "Error: You have already cast your vote on this proposal or you are not registered as a voter"
        );
        _;
    }

    //EVENTS
    event ProposalCreated(
        uint256 proposalId,
        address creatorAddress,
        string officialName,
        string description,
        uint256 createdAt,
        State status
    );
    event VoterAdded(
        uint256 proposalId,
        address voterAddress,
        string voterName
    );
    event VoteDone(uint256 proposalId);
    event VotingStarted(uint256 proposalId);
    event VotingEnded(uint256 proposalId, uint256 votesInFavor);

    //FUNCTIONS
    constructor() {
        createProposal("My first proposal", "For testing purposes");
    }

    function createProposal(
        string memory _officialName,
        string memory _description
    ) public {
        proposalCounter++;
        proposals[proposalCounter] = VotingProposal(
            msg.sender,
            proposalCounter,
            _officialName,
            _description,
            block.timestamp,
            State.Created
        );
        helperCounters[proposalCounter] = HelperCounter(0, 0, 0);
        emit ProposalCreated(
            proposalCounter,
            msg.sender,
            _officialName,
            _description,
            block.timestamp,
            State.Created
        );
    }

    function addVoter(
        uint256 _proposalId,
        address _voterAddress,
        string memory _voterName
    ) public inState(State.Created, _proposalId) {
        helperCounters[_proposalId].totalRegisteredVoters++;
        voterNames[_voterAddress] = _voterName;
        voterRegistry[_voterAddress][_proposalId] = false;
        emit VoterAdded(_proposalId, _voterAddress, _voterName);
    }

    function deleteProposal(uint256 _id)
        public
        inState(State.Created, _id)
        onlyOfficial(_id)
    {
        delete proposals[_id];
    }

    function startVote(uint256 _id)
        public
        inState(State.Created, _id)
        onlyOfficial(_id)
    {
        VotingProposal memory _proposal = proposals[_id];
        _proposal.status = State.Voting;
        proposals[_id] = _proposal;
        emit VotingStarted(_id);
    }

    function doVote(uint256 _id, bool _choice)
        public
        hasNotVoted(_id)
        inState(State.Voting, _id)
    {
        voterRegistry[msg.sender][_id] = true;
        Vote memory v;
        v.proposalId = _id;
        v.choice = _choice;
        if (_choice) {
            countResult[_id]++;
        }
        votes[_id][helperCounters[_id].totalVotesCast++] = v;
        helperCounters[_id].totalVotesCast++;
        emit VoteDone(_id);
    }

    function endVote(uint256 _id)
        public
        inState(State.Voting, _id)
        onlyOfficial(_id)
    {
        VotingProposal memory _proposal = proposals[_id];
        _proposal.status = State.Ended;
        proposals[_id] = _proposal;
        helperCounters[_id].totalVotesInFavor = countResult[_id];
        emit VotingEnded(_id, countResult[_id]);
    }
}
