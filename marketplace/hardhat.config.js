require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');

// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      chainId: 11155111
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/dCdBA95lq6QqjtUQNDLX8rRuAOZr1vBv",
      // accounts: [process.env.REACT_APP_PRIVATE_KEY],
      
      accounts: ['8306101c009c99f1362d007737c129bd9b787a2ea920dd5eb53d2137e4e96895'],
      chainId: 11155111,
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/nAhiCHKvZkhkp4A7PkkCIBON0-BXW26d",
      //accounts: [process.env.privateKey]
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};