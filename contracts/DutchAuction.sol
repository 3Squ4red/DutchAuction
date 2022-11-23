// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

contract DutchAuction {
    uint private constant DURATION = 7 days;

    IERC721 public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    // amount in wei that must be dcreased from the starting price every second
    uint public immutable discountRate;

    // Note that this error can also be thrown when the starting price is set too low
    // lower than 604800 wei to be precise
    error TooHighDiscountRate(uint maxDiscount);

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) {
        uint maxDiscount = _discountRate * DURATION;
        // Checking whether the auction can even run for 7 days at `_discountRate`
        if (maxDiscount > _startingPrice)
            revert TooHighDiscountRate(maxDiscount);

        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
        discountRate = _discountRate;

        nft = IERC721(_nft);
        nftId = _nftId;
    }

    error AuctionExpired(uint expiredAt);
    modifier auctionExpired() {
        if (block.timestamp > expiresAt) revert AuctionExpired(expiresAt);
        _;
    }

    function getPrice() public view auctionExpired returns (uint) {
        uint timeElapsed = block.timestamp - startAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    error InsufficientAmount(uint nftPrice);
    error SellerCantBuy();

    function buy() external payable auctionExpired {
        if (msg.sender == seller) revert SellerCantBuy();
        uint price = getPrice();
        if (msg.value < price) revert InsufficientAmount(price);

        nft.transferFrom(seller, msg.sender, nftId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(seller);
    }
}
