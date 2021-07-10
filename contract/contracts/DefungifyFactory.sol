// SPDX-License-Identifier: Zlib
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./Defungify.sol";

contract DefungifyFactory {
    mapping(IERC20Metadata => address) public deployedContracts;

    constructor() {}

    function deployDf(IERC20Metadata token) public returns (address) {
        require(deployedContracts[token] == address(0), "defungify token already exists");

        string memory name = string(abi.encodePacked("Defungify ", token.name()));
        string memory symbol = string(abi.encodePacked("df", token.symbol()));
        Defungify df = new Defungify(token, name, symbol);
        deployedContracts[token] = address(df);

        return address(df);
    }
}
