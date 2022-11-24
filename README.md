# DutchAuction

![image](https://user-images.githubusercontent.com/29842127/203652807-8e24f5af-a91e-4e97-a10b-eaa4ffbc4118.png)


A *Dutch Auction* is an auction where the seller of an item sets the price at beginning of the auction and the price goes down over time.
When a buyer thinks that the price is low enough, he buys the item and the auction ends.

A dutch auction works like an expensive fashion clothe that goes on sale.

Imagine that a branded T-shirt is selling for $300 and you think that the t-shirt is overpriced so you decided to wait for some time. And over time the t-shirt will go on **sale**. At first, the t-shirt goes on 10% sale and you still think it's too expensive, after some time the t-shirt goes on sale again for 20% discount and then for 30%, 40%, 50%! and at this point you decide that it has a fair price. So you go ahead and buy the t-shirt, ending the auction.
Also note, that you could have totally missed the chance to buy the t-shirt if someone else wanted it more, and was willing to pay more for it while you were still waiting for it's price to decrease further.

Essentially, this is how *Dutch Auction* works, initially the price is set high by the seller and over time, the price decreases, when a buyer thinks that it is a good deal and the item has a fair price, he buys it and the auction ends.

In this project, I used [Hardhat](https://hardhat.org/) to create a time-bound dutch auction contract for an ERC-721 NFT, which automatically expires 7 days after being deployed if no one buys the NFT.

## How to use
1. Clone the repository
```
git clone https://github.com/bytecode-velocity/DutchAuction.git
```
2. Change directory
```
cd DutchAuction
```
3. Install the packages
```
npm install
```
4. Try running the test
```
npx hardhat test
```
5. Or deploy it locally
```
npx hardhat run scripts/deploy.js
```
