// SPDX-License-Identifier: Zlib
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Defungify is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  mapping(uint256 => uint256) private _amountInside;

  IERC20 public token;

  constructor(IERC20 token_, string memory name, string memory symbol) ERC721(name, symbol) {
    token = token_;
  }

  function safeMint(address to, uint256 amount, string memory uri) public {
    // Mint NFT, set amount
    _safeMint(to, _tokenIdCounter.current());
    _setTokenURI(_tokenIdCounter.current(), uri);
    _amountInside[_tokenIdCounter.current()] = amount;
    _tokenIdCounter.increment();

    // Send funds to contract
    bool t = token.transferFrom(msg.sender, address(this), amount);
    require(t, "token transfer failed");
  }

  function burn(uint256 tokenId) public override(ERC721Burnable) {
    // Burn token, set amount to 0
    super.burn(tokenId);
    uint256 amount = _amountInside[tokenId];
    _amountInside[tokenId] = 0;

    // Send
    bool t = token.transfer(msg.sender, amount);
    require(t, "token transfer failed");
  }

  function amountInside(uint256 tokenId) public view returns (uint256) {
    return _amountInside[tokenId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
    return super.supportsInterface(interfaceId);
  }
}
