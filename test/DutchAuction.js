const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("DutchAuction", () => {
  let seller, buyer, nft, auction, Auction;
  const STARTING_PRICE = 1_000_000;
  const DISCOUNT_RATE = 1;
  const DURATION = 7 * 24 * 60 * 60;

  before(async () => {
    [seller, buyer] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("MyNFT");
    nft = await NFT.deploy();

    // Minting an NFT of id 555 to seller
    await nft.mint(seller.address, 555);

    // Checking the owner of 555
    expect(await nft.ownerOf(555)).to.equal(seller.address);
  });

  describe("Deploying", () => {
    before(async () => {
      Auction = await ethers.getContractFactory("DutchAuction");
    });
    it("should revert with a high discount rate", async () => {
      await expect(
        Auction.deploy(STARTING_PRICE, DISCOUNT_RATE * 2, nft.address, 555)
      )
        .to.revertedWithCustomError(Auction, "TooHighDiscountRate")
        .withArgs(DISCOUNT_RATE * 2 * DURATION);
    });
    it("should successfully depoloy the auction contract", async () => {
      // Deploying the auction contract
      auction = await Auction.deploy(
        STARTING_PRICE,
        DISCOUNT_RATE,
        nft.address,
        555
      );
      // Approving the auction contract to make transfers
      await nft.approve(auction.address, 555);
    });
  });

  describe("Checking price", () => {
    beforeEach(async () => {
      auction = await Auction.deploy(
        STARTING_PRICE,
        DISCOUNT_RATE,
        nft.address,
        555
      );
      // Approving the auction contract to make transfers
      await nft.approve(auction.address, 555);
    });
    it("1 day after the auction, the price should around 913,600", async () => {
      const ONE_DAY_IN_SEC = 24 * 60 * 60;
      await time.increase(ONE_DAY_IN_SEC);
      expect(await auction.getPrice()).to.closeTo(913600, 5);
    });
    it("3 day after the auction, the price should around 740,800", async () => {
      const THREE_DAYS_IN_SEC = 3 * 24 * 60 * 60;
      await time.increase(THREE_DAYS_IN_SEC);
      expect(await auction.getPrice()).to.closeTo(740799, 5);
    });
    it("should revert while getting the price after 7 days", async () => {
      await time.increase(DURATION);
      await expect(auction.getPrice())
        .to.revertedWithCustomError(auction, "AuctionExpired")
        .withArgs(await auction.expiresAt());
    });
  });
  describe("Buying", () => {
    beforeEach(async () => {
      auction = await Auction.deploy(
        STARTING_PRICE,
        DISCOUNT_RATE,
        nft.address,
        555
      );
      // Approving the auction contract to make transfers
      await nft.approve(auction.address, 555);
    });
    it("should revert while buying after the auction expired", async () => {
      await time.increase(DURATION);
      await expect(auction.connect(buyer).buy())
        .to.revertedWithCustomError(auction, "AuctionExpired")
        .withArgs(await auction.expiresAt());
    });
    it("should revert if seller tries to buy", async () => {
      await expect(auction.connect(seller).buy()).to.revertedWithCustomError(
        auction,
        "SellerCantBuy"
      );
    });
    it("should revert while paying no/less amount", async () => {
      const currentPrice = await auction.getPrice();
      await expect(auction.connect(buyer).buy())
        .to.revertedWithCustomError(auction, "InsufficientAmount")
        .withArgs(currentPrice - 1); // -1 because its taking 1 extra second to call buy() function
    });
    it("should successfully buy the NFT", async () => {
      await auction
        .connect(buyer)
        .buy({ value: ethers.utils.parseEther("0.1") });

      // Checking the owner of the 555 NFT+
      expect(await nft.ownerOf(555)).to.equal(buyer.address);
    });
  });
});

/**
 * Starting price: 1,000,000 wei
 * Discount rate: 1
 * Deploying Auction contract
 * Should revert with a very high discount rate
 * Should successfully create a dutch auction
 * Checking price
 * 1 day after the auction, the price should be 913,600
 * 3 day after the auction, the price should be 740,800
 * Should revert while getting the price after 7 days
 * Buying
 * Should revert after the auction expired
 * Should revert if seller tries to buy
 * Should revert while paying less than the current price
 * Should successfully buy the NFT
 */
