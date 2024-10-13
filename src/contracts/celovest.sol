// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error TransferFailed();

contract CeloVest {
    struct SafeData {
        address owner;
        uint256 amount;
        uint256 releaseTime;
        bool isLocked;
    }

    mapping(address => SafeData[]) public safes;

    IERC20 public s_savingToken;

    event FundsTransferred(address indexed user, uint256 indexed amount);
    event SafeCreated(
        address indexed owner,
        uint256 indexed safeId,
        uint256 indexed createdAt
    );

    event SafeLocked(
        address indexed owner,
        uint256 indexed safeId,
        uint256 indexed lockedAt
    );
    event SafeUnlocked(
        address indexed owner,
        uint256 indexed safeId,
        uint256 indexed unlockedAt
    );

    event Withdrawn(
        address indexed owner,
        uint256 safed,
        uint256 indexed amount,
        uint256 withdrawTime
    );
    event ForceWithdrawn(
        address indexed owner,
        uint256 indexed amount,
        uint256 indexed penalty
    );

    constructor(address _savingToken) {
        s_savingToken = IERC20(_savingToken);
    }

    //create safe
    function createSafe(uint256 _amount, uint256 _duration) public payable {
        require(
            _duration > block.timestamp,
            "Release time must be in the future"
        );
        safes[msg.sender].push(SafeData(msg.sender, _amount, _duration, false));

        bool success = s_savingToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) {
            revert TransferFailed();
        }

        emit SafeCreated(msg.sender, msg.value, _duration);
    }

    //top up the safe amount
    function topUpSafe(uint256 _safeId, uint256 _amount) public payable {
        require(_safeId < safes[msg.sender].length, "Safe does not exist");
        SafeData storage safe = safes[msg.sender][_safeId];
        safe.amount = safe.amount + _amount;
        bool success = s_savingToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) {
            revert TransferFailed();
        }
    }

    //unlockSafe when the duration is done

    function unlockSafe(uint256 _safeId) public {
        require(_safeId < safes[msg.sender].length, "Safe does not exist");
        SafeData storage safe = safes[msg.sender][_safeId];
        require(
            safe.releaseTime <= block.timestamp,
            "time for unlock has not yet passed"
        );
        safe.isLocked = false;
        emit SafeUnlocked(msg.sender, _safeId, block.timestamp);
    }

    //withdraw from the safe
    function withdrawFromSafe(uint256 _safeId, uint256 _amount) public {
        require(_safeId < safes[msg.sender].length, "Safe does not exist");
        SafeData storage safe = safes[msg.sender][_safeId];
        require(safe.isLocked = false, "safe is still locked");
        safe.amount = safe.amount - _amount;
        bool success = s_savingToken.transfer(msg.sender, _amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    //force withdraw fromt the safe
    function forceWithdrawFromSafe(uint256 _safeId, uint256 _amount) public {
        require(_safeId < safes[msg.sender].length, "Safe does not exist");
        SafeData storage safe = safes[msg.sender][_safeId];
        require(safe.isLocked = true, "safe is already unlocked");
        uint256 penalty = (safe.amount * 10) / 100;
        safe.amount = safe.amount - _amount;
        bool success = s_savingToken.transfer(msg.sender, _amount - penalty);
        if (!success) {
            revert TransferFailed();
        }
        emit SafeUnlocked(msg.sender, _safeId, block.timestamp);
    }

    //get al lthe users safes
    function getMySafes() public view returns (SafeData[] memory) {
        return safes[msg.sender];
    }

    //get the details about a safe
    function getSafeDetails(uint256 _safeId)
        public
        view
        returns (SafeData memory)
    {
        return safes[msg.sender][_safeId];
    }

    //goal savings
    struct GoalSaving {
        string goalTitle;
        uint256 targetAmount;
        uint256 currentAmount;
        bool isActive;
    }
    event DepositToGoal(
        address indexed user,
        uint256 goalId,
        uint256 amount,
        uint256 depositedAt
    );
    event GoalSavingSet(address indexed user, uint256 indexed targetAmount);
    mapping(address => GoalSaving[]) public goalSavings;

    //create new saving goal
    function createNewSavingGoal(string memory _title, uint256 _targetAmount)
        public
    {
        goalSavings[msg.sender].push(
            GoalSaving(_title, _targetAmount, 0, true)
        );
        emit GoalSavingSet(msg.sender, _targetAmount);
    }

    //deposit money towards the goal campaign
    function depositTowardsGoal(uint256 _goalId, uint256 _amount)
        public
        payable
    {
        require(
            _goalId < goalSavings[msg.sender].length,
            "Safe does not exist"
        );
        GoalSaving storage goalStore = goalSavings[msg.sender][_goalId];

        goalStore.currentAmount = goalStore.currentAmount + _amount;
        bool success = s_savingToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) {
            revert TransferFailed();
        }

        emit DepositToGoal(msg.sender, _goalId, _amount, block.timestamp);
    }

    //transfer from the goal campaign
    //require the goal has been hit

    function withdrawFromGoalCampaign(uint256 _goalId, uint256 _amount)
        public
        payable
    {
        require(
            _goalId < goalSavings[msg.sender].length,
            "Safe does not exist"
        );
        GoalSaving storage goalStore = goalSavings[msg.sender][_goalId];
        require(
            goalStore.currentAmount >= goalStore.targetAmount,
            "You have not reached your target amount yet"
        );

        goalStore.isActive = false;
        bool success = s_savingToken.transfer(msg.sender, _amount);
        if (!success) {
            revert TransferFailed();
        }
        emit FundsTransferred(msg.sender, _amount);
    }

    //get all my current goal campaigns
    function getAllGoalSavings() public view returns (GoalSaving[] memory) {
        return goalSavings[msg.sender];
    }

    //create a community of savers
    struct CommunitySaving {
        string goalTitle; //title od the campaign
        string description; //description of the campaign
        address admin; //owner of the campaign
        uint256 targetAmount; //target intended to be raised
        uint256 currentAmount; //amount so far raised
        bool isActive; //is the campaing still ongoaing
        address[] newRequests; //store the addresses of members that have requested to join the community
        address[] memberAddresses; //all the members that are part of the campaign
        mapping(address => uint256) memberHoldings; //store what each member has contributed towards that campaign
    }

    event NewComCampaign(
        address indexed owner,
        string title,
        string description,
        uint256 createdAt
    );
    event NewMemberRequest(
        address indexed member,
        uint256 communityId,
        uint256 requestAt
    );
    event DepositToComGoal(
        address indexed user,
        uint256 amount,
        uint256 communityId,
        uint256 depositAt
    );

    //store all the curently going on campaigns
    mapping(uint256 => CommunitySaving) public groupSavingCampaigns;
    uint256 public communityCampaignIndex;

    //create a new community saving campaign
    function createNewCommunitySavingCampaign(
        string memory _title,
        string memory _desc,
        uint256 _targetAmount
    ) public {
        CommunitySaving storage r = groupSavingCampaigns[
            communityCampaignIndex
        ];
        r.admin = msg.sender;
        r.currentAmount = 0;
        r.description = _desc;
        r.goalTitle = _title;
        r.isActive = true;
        r.targetAmount = _targetAmount;
        r.memberAddresses.push(msg.sender);
        r.memberHoldings[msg.sender] = 0;

        communityCampaignIndex++;
    }

    //request to join a commuunity saving campaign

    function requestToJoinCommunity(uint256 _id) public {
        CommunitySaving storage r = groupSavingCampaigns[_id];
        require(!checkIsComMember(_id, msg.sender),
            "You are already part of the community");
        r.newRequests.push(msg.sender);
        emit NewMemberRequest(msg.sender, _id, block.timestamp);
    }

    //add new user to the community
    function approveMemberToCommunity(uint256 _id, address user) public {
        CommunitySaving storage r = groupSavingCampaigns[_id];
        require(r.admin == msg.sender, "You are not authorized");

        r.memberAddresses.push(user);

        for (uint256 i = 0; i < r.newRequests.length; i++) {
            if (r.newRequests[i] == user) {
                r.newRequests[i] = r.newRequests[r.newRequests.length - 1];
                r.newRequests.pop();
            }
        }
        emit NewMemberRequest(msg.sender, _id, block.timestamp);
    }

//deny the user from joining the community
function denyMemberToCommunity(uint256 _id, address user) public {
        CommunitySaving storage r = groupSavingCampaigns[_id];
        require(r.admin == msg.sender, "You are not authorized");

        for (uint256 i = 0; i < r.newRequests.length; i++) {
            if (r.newRequests[i] == user) {
                r.newRequests[i] = r.newRequests[r.newRequests.length - 1];
                r.newRequests.pop();
            }
        }
    }



    //check if the address is a member of a certain community
    function checkIsComMember(uint256 _commId, address _member)
        private
        view
        returns (bool)
    {
        CommunitySaving storage r = groupSavingCampaigns[_commId];
        for (uint256 i = 0; i < r.newRequests.length; i++) {
            if (r.newRequests[i] == _member) {
                return true;
            }
        }
        return false;
    }

    // contribute to the community fund
    function contributeToCommunityFund(uint256 commId, uint256 _amount)
        public
        payable
    {
        CommunitySaving storage r = groupSavingCampaigns[commId];
        require(
            checkIsComMember(commId, msg.sender),
            "You are not part of the community"
        );

        r.memberHoldings[msg.sender] += _amount;
        r.targetAmount += _amount;
        bool success = s_savingToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) {
            revert TransferFailed();
        }
    }

    //distribute the amount to the community members once the trgetamount has been reached
    function distributeContributions(uint256 _commId) public payable {
        CommunitySaving storage r = groupSavingCampaigns[_commId];
        require(r.currentAmount >= r.targetAmount, "You are not authorized");

        for (uint256 i = 0; i < r.memberAddresses.length; i++) {
            //get the total amount of the individual's contribution
            uint256 _amount = r.memberHoldings[r.memberAddresses[i]];
            if (_amount > 0) {
                r.memberHoldings[r.memberAddresses[i]] = 0;
                bool success = s_savingToken.transfer(msg.sender, _amount);
                if (!success) {
                    revert TransferFailed();
                }
            }
        }
        r.isActive=false;
    }

    //get the total number of community projects
    function getTotalCommunityProjects() public view returns (uint256) {
        return communityCampaignIndex;
    }

    //get title,desciption,target,current,members,requestsz of a specific community
    function getCommDetails(uint256 _commId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            bool,
            address[] memory,
            address,
            address [] memory
        )
    {
        CommunitySaving storage r = groupSavingCampaigns[_commId];
        return (
            r.goalTitle,
            r.description,
            r.targetAmount,
            r.currentAmount,
            r.isActive,
            r.memberAddresses,
            r.admin,
            r.newRequests
        );
    }

    //get the individual token holdings for each addrss in t he community
    function getIndivTokenHoldings(uint256 _commId)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        CommunitySaving storage r = groupSavingCampaigns[_commId];
        uint256[] memory allBalances = new uint256[](r.memberAddresses.length);
        for (uint256 i = 0; i < r.memberAddresses.length; i++) {
            allBalances[i] = r.memberHoldings[r.memberAddresses[i]];
        }
        return (r.memberAddresses, allBalances);
    }

    //get all the addresses that have requested to join a community
    function getAllCommunityRequests(uint256 _commId)
        public
        view
        returns (address[] memory)
    {
        CommunitySaving storage r = groupSavingCampaigns[_commId];
        return r.newRequests;
    }
}
