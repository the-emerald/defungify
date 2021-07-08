// @ts-ignore
import {ethers} from "hardhat";
import {expect} from "chai";

describe("Defungify", function () {
    let accounts: any;
    let erc20Token: any;
    let defungifyFactory: any;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const DefungifyFactory = await ethers.getContractFactory("DefungifyFactory");
        defungifyFactory = await DefungifyFactory.deploy();
        await defungifyFactory.deployed();

        const ERC20 = await ethers.getContractFactory("ERC20PresetMinterPauser");
        erc20Token = await ERC20.connect(accounts[0]).deploy("Test ERC20", "TEST");
        await erc20Token.deployed();
        // 100,000,000
        await erc20Token.connect(accounts[0]).mint(await accounts[0].getAddress(), 100000000);
        await erc20Token.connect(accounts[0]).mint(await accounts[1].getAddress(), 100000000);
    })

    it("Should be able to deploy a Defungify", async function () {
        await defungifyFactory.deployDf(erc20Token.address);
    });

    it("Should not be able to deploy twice", async function () {
        await defungifyFactory.deployDf(erc20Token.address);
        expect(defungifyFactory.deployDf(erc20Token.address))
            .to.be
            // @ts-ignore
            .revertedWith("defungify token already exists");
    });


});