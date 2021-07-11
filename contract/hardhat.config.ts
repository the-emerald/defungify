import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter"
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import {ALCHEMY_API_KEY, MNEMONIC} from "./secrets";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },

  gasReporter: {
    currency: 'USD',
    gasPrice: 1,
    excludeContracts: ["ERC20PresetMinterPauser"]
  },

  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: {
        mnemonic: MNEMONIC
      },
    },
    xdai: {
      url: `https://rpc.xdaichain.com`,
      chainId: 100,
      accounts: {
        mnemonic: MNEMONIC
      },
      gasPrice: 1_000_000_000 // 1 Gwei
    }
  },
};
