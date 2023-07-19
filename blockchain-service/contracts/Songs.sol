// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Songs {
    //the artist who will save their songs to this contract
    address payable private owner;
    
    //mapping songid => song data
    mapping (address => bytes) private songRepository;

    //constructor
    constructor () {
        owner = payable(msg.sender);
    }

    //getSongData(songid: string) returns songdata: bytes
    function getSongData (string calldata songid) public view returns(bytes memory data) {

    }

    //uploadSongData(songid: string, songdata: bytes) returns nothing
    function uploadSongData (string calldata songid, string calldata songData) public {

    }
    //deleteSong(songid: string) returns nothing
    function deleteSong (string calldata songid) public {
        
    }
}