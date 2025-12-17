// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC721URIStorage, Ownable {
    uint256 public nextId;
    
    constructor(address initialOwner)
        ERC721("DIDLab Hackathon Badge", "DLHB")
        Ownable(initialOwner)
    {}
    
    function mintTo(address to, string memory uri)
        external onlyOwner returns (uint256 tokenId)
    {
        tokenId = ++nextId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}
