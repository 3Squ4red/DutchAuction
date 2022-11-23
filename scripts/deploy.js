async function main() {
  const startingPrice = 1_000_000;
  const discountRate = 1;
  const [seller] = await ethers.getSigners();

  // Deploying the NFT contract
  console.log("Deploying the NFT contract...");
  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log(`NFT deployed at ${nft.address}`);

  // Minting an NFT
  console.log(`Minting an NFT with 555 id for the seller: ${seller.address}`);
  await nft.mint(seller.address, 555);

  // Deploying the Auction contract
  console.log("Deploying the auction contract...");
  const Auction = await ethers.getContractFactory("DutchAuction");
  const auction = await Auction.deploy(
    startingPrice,
    discountRate,
    nft.address,
    555
  );
  await auction.deployed();
  console.log(
    `DutchAuction deployed at ${
      auction.address
    } for NFT ID ${await auction.nftId()} at ${await auction.nft()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
