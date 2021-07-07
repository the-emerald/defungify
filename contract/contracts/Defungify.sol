// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Defungify is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  mapping(uint256 => uint256) private amountInside;

  IERC20 public token;

  constructor(IERC20 token_, string memory name, string memory ticker) ERC721(name, ticker) {
    token = token_;
  }

  function safeMint(address to, uint256 amount) public whenNotPaused {
    // Mint NFT, set amount
    _safeMint(to, _tokenIdCounter.current());
    amountInside[_tokenIdCounter.current()] = amount;
    _tokenIdCounter.increment();

    // Send funds to contract
    bool t = token.transferFrom(msg.sender, address(this), amount);
    require(t, "token transfer failed");
  }

  function burn(uint256 tokenId) public override(ERC721Burnable) {
    // Burn token, set amount to 0
    super.burn(tokenId);
    uint256 amount = amountInside[tokenId];
    amountInside[tokenId] = 0;

    // Send
    bool t = token.transfer(msg.sender, amount);
    require(t, "token transfer failed");
  }

  function amountInToken(uint256 tokenId) public view returns (uint256) {
    return amountInside[tokenId];
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal whenNotPaused override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
    return super.supportsInterface(interfaceId);
  }
}
