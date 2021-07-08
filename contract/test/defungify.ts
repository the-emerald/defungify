// @ts-ignore
import {ethers} from "hardhat";
import {expect} from "chai";

describe("Defungify", function () {
    let accounts: any;
    let erc20Token: any;
    let defungify: any;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("ERC20PresetMinterPauser");
        erc20Token = await ERC20.connect(accounts[0]).deploy("Test ERC20", "TEST");
        await erc20Token.deployed();
        // 100,000,000
        await erc20Token.connect(accounts[0]).mint(await accounts[0].getAddress(), 100000000);
        await erc20Token.connect(accounts[0]).mint(await accounts[1].getAddress(), 100000000);

        const Defungify = await ethers.getContractFactory("Defungify");
        defungify = await Defungify.deploy(erc20Token.address, "Defungify TEST", "DEFUNG-TEST");
        await defungify.deployed();
    })

    it("Should be able to mint", async function () {
        await erc20Token.connect(accounts[1]).approve(defungify.address, 100000);
        // 100,000
        await defungify.connect(accounts[1]).safeMint(await accounts[1].getAddress(), 100000, "");
        expect(await defungify.amountInside(0)).to.equal(100000);
        expect(await erc20Token.balanceOf(await accounts[1].getAddress())).to.equal(100000000 - 100000);
    });

    it("Should be able to redeem", async function () {
        await erc20Token.connect(accounts[1]).approve(defungify.address, 100000);

        // 100,000
        await defungify.connect(accounts[1]).safeMint(await accounts[1].getAddress(), 100000, "");
        expect(await defungify.amountInside(0)).to.equal(100000);
        expect(await erc20Token.balanceOf(await accounts[1].getAddress())).to.equal(100000000 - 100000);

        await defungify.connect(accounts[1]).burn(0);
        expect(await defungify.amountInside(0)).to.equal(0);
        // @ts-ignore
        expect(defungify.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
        expect(await erc20Token.balanceOf(await accounts[1].getAddress())).to.equal(100000000);
    });

    it("Should be able to send and redeem", async function () {
        await erc20Token.connect(accounts[1]).approve(defungify.address, 100000);

        // 100,000
        await defungify.connect(accounts[1]).safeMint(await accounts[1].getAddress(), 100000, "");
        expect(await defungify.amountInside(0)).to.equal(100000);
        expect(await erc20Token.balanceOf(await accounts[1].getAddress())).to.equal(100000000 - 100000);

        await defungify.connect(accounts[1])['safeTransferFrom(address,address,uint256)'](await accounts[1].getAddress(), await accounts[0].getAddress(), 0);
        expect(await defungify.ownerOf(0)).to.equal(await accounts[0].getAddress());

        await defungify.connect(accounts[0]).burn(0);
        expect(await defungify.amountInside(0)).to.equal(0);
        // @ts-ignore
        expect(defungify.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
        expect(await erc20Token.balanceOf(await accounts[0].getAddress())).to.equal(100000000 + 100000);
    });

});
