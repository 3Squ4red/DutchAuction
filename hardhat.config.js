const { task, HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

task("hello", "Says you hello world!", async () => {
  console.log("Hey there! 👋 Hello");
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
    },
  },
};
