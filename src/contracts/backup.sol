// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
//meyfGWNTFicNZ4fTWg5Nnmxes2dSEUZCRawJLTx4iLZ
//F89g8hdSRtJPHfzddUFiGD8MAWzj6CTX73Jpyt9w6SkY
//8v2mTnCfR1fzwJEY5DjXMGFu4LUs34sgyY17Zs4Z7kHy
//8CGJPWdM7xZX5E2ZE7qw5TiNUgpLyUeXJAnHr5goezeD
//MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa
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
        bool success = s_savingToken.transfer(msg.sender, _amount);
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
}
