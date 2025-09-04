// Sources flattened with hardhat v2.26.2 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/Ezpay.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;


/**
 * @title Ezpay
 * @dev Smart contract for creating and paying bills via payment links
 * @author Ezpay Team
 */
contract Ezpay is ReentrancyGuard {
    struct Bill {
        address receiver;
        address token; // address(0) for ETH
        uint256 amount;
        bool paid;
        uint256 createdAt;
        uint256 paidAt;
        address payer;
    }

    struct Authorization {
        address authorizer;
        bytes32 billId;
        uint256 nonce;
        uint256 chainId;
        address contractAddress;
        bytes signature;
    }

    mapping(bytes32 => Bill) public bills;
    mapping(address => bytes32[]) public userBills;
    mapping(address => uint256) public nonces;
    
    uint256 public totalBills;
    uint256 public totalPaidBills;
    
    event BillCreated(
        bytes32 indexed billId,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    
    event BillPaid(
        bytes32 indexed billId,
        address indexed payer,
        address indexed receiver,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    error BillAlreadyExists();
    error BillNotFound();
    error BillAlreadyPaid();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();
    error InvalidAuthorization();
    error InvalidNonce();

    constructor() {}

    /**
     * @dev Create a new bill with unique ID
     * @param billId Unique identifier for the bill
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to be paid
     */
    function createBill(
        bytes32 billId,
        address token,
        uint256 amount
    ) external {
        if (bills[billId].receiver != address(0)) {
            revert BillAlreadyExists();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }

        bills[billId] = Bill({
            receiver: msg.sender,
            token: token,
            amount: amount,
            paid: false,
            createdAt: block.timestamp,
            paidAt: 0,
            payer: address(0)
        });

        userBills[msg.sender].push(billId);
        totalBills++;

        emit BillCreated(billId, msg.sender, token, amount, block.timestamp);
    }

    /**
     * @dev Pay an existing bill (standard method)
     * @param billId ID of the bill to pay
     */
    function payBill(bytes32 billId) external payable nonReentrant {
        _payBill(billId, msg.sender, msg.value);
    }

    /**
     * @dev Pay a bill using a signed authorization (app-level)
     * This allows a sponsor/relayer to pay gas fees while the actual payment comes from the authorizer
     * @param authorization The authorization struct containing signature and details
     */
    function payBillWithAuthorization(
        Authorization calldata authorization
    ) external payable nonReentrant {
        // Verify the authorization
        if (!_verifyAuthorization(authorization)) {
            revert InvalidAuthorization();
        }
        
        // Check nonce
        if (authorization.nonce != nonces[authorization.authorizer]) {
            revert InvalidNonce();
        }
        
        // Increment nonce
        nonces[authorization.authorizer]++;
        
        // Get bill details
        Bill storage bill = bills[authorization.billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        // For ETH payments, the sponsor needs to send the ETH value
        if (bill.token == address(0)) {
            if (msg.value != bill.amount) {
                revert InvalidAmount();
            }
            
            (bool success, ) = payable(bill.receiver).call{value: bill.amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // For ERC20, transfer from the authorizer's balance
            if (msg.value > 0) {
                revert InvalidAmount();
            }
            
            IERC20 token = IERC20(bill.token);
            if (token.balanceOf(authorization.authorizer) < bill.amount) {
                revert InsufficientBalance();
            }
            
            // Transfer from authorizer to receiver
            bool success = token.transferFrom(authorization.authorizer, bill.receiver, bill.amount);
            if (!success) {
                revert TransferFailed();
            }
        }

        // Update bill status
        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = authorization.authorizer;
        totalPaidBills++;

        emit BillPaid(
            authorization.billId,
            authorization.authorizer,
            bill.receiver,
            bill.token,
            bill.amount,
            block.timestamp
        );
    }

    /**
     * @dev Internal function to process standard bill payment
     */
    function _payBill(bytes32 billId, address payer, uint256 msgValue) internal {
        Bill storage bill = bills[billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        if (bill.token == address(0)) {
            // ETH payment
            if (msgValue != bill.amount) {
                revert InvalidAmount();
            }
            
            (bool success, ) = payable(bill.receiver).call{value: bill.amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // ERC20 payment
            if (msgValue > 0) {
                revert InvalidAmount();
            }
            
            IERC20 token = IERC20(bill.token);
            if (token.balanceOf(payer) < bill.amount) {
                revert InsufficientBalance();
            }
            
            bool success = token.transferFrom(payer, bill.receiver, bill.amount);
            if (!success) {
                revert TransferFailed();
            }
        }

        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = payer;
        totalPaidBills++;

        emit BillPaid(
            billId,
            payer,
            bill.receiver,
            bill.token,
            bill.amount,
            block.timestamp
        );
    }

    /**
     * @dev Verify app-level signed authorization
     */
    function _verifyAuthorization(Authorization calldata auth) internal view returns (bool) {
        // Create the message hash that was signed
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        auth.billId,
                        auth.nonce,
                        auth.chainId,
                        auth.contractAddress
                    )
                )
            )
        );
        
        // Recover signer from signature
        address signer = _recoverSigner(messageHash, auth.signature);
        
        // Verify the signer matches the authorizer
        return signer == auth.authorizer && 
               auth.chainId == block.chainid && 
               auth.contractAddress == address(this);
    }

    /**
     * @dev Recover signer address from signature
     */
    function _recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature v value");
        
        return ecrecover(messageHash, v, r, s);
    }

    /**
     * @dev Get bill details
     */
    function getBill(bytes32 billId) external view returns (Bill memory) {
        return bills[billId];
    }

    /**
     * @dev Get all bills created by a user
     */
    function getUserBills(address user) external view returns (bytes32[] memory) {
        return userBills[user];
    }

    /**
     * @dev Check if a bill exists and is unpaid
     */
    function billStatus(bytes32 billId) external view returns (bool exists, bool isPaid) {
        Bill memory bill = bills[billId];
        exists = bill.receiver != address(0);
        isPaid = bill.paid;
    }

    /**
     * @dev Generate a unique bill ID
     */
    function generateBillId(address user, uint256 nonce) external view returns (bytes32) {
        return keccak256(abi.encodePacked(user, nonce, block.timestamp));
    }

    /**
     * @dev Get current nonce for an address
     */
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }
}
