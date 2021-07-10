// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// @ts-ignore
import {run, ethers} from "hardhat";
import {factoryLocation} from "../../frontend/src/factoryLocation";

// Rinkeby
const TARGET_ERC20 = "0xd099F2FD6df4f649B2cD9A80EfCA8d496D9c3825";

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    console.log("Defungify factory:", factoryLocation.get(4));

    const defungifyFactory = await ethers.getContractAt(
        "DefungifyFactory",
        factoryLocation.get(4)!
    );
    console.log("deployedContract:", await defungifyFactory.deployedContracts(TARGET_ERC20));

    await defungifyFactory.deployDf(TARGET_ERC20);

    console.log("Created Defungify at:", await defungifyFactory.deployedContracts(TARGET_ERC20));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
