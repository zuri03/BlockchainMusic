// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//TODO: Add functionality to pay the author whenever getSongData() is called

contract Songs {
    //the blockchain service account that deploys contracts
    address private owner;

    //the user who will upload their songs to this contract
    address payable private author;
    
    //mapping songid => song data
    mapping (string => bytes) private songDataRepository;

    modifier restrictAccess () {
        require(msg.sender == owner, "Must be owner to access this operation");
        _;
    }

    constructor () {
        owner = payable(msg.sender);
    }

    //Get a song matching an id
    function getSongData (string calldata songid) public view returns(bytes memory) {
        require(bytes(songid).length > 0, "An id must be provided");
        require(songDataRepository[songid].length == 0, "A song could not be found matching the id provided");

        bytes memory songData = songDataRepository[songid];
        return songData;
    }

    //upload a new song to the contract
    function uploadSongData (string calldata songid, bytes calldata songData) restrictAccess public {
        require(bytes(songid).length > 0, "A song must be given an id");
        require(songData.length > 0, "A song must have data");

        songDataRepository[songid] = songData;
    }

    //Delete a song matching an id
    function deleteSong (string calldata songid) restrictAccess public {
        require(bytes(songid).length > 0, "An id must be provided");
        require(songDataRepository[songid].length == 0, "A song could not be found matching the id provided");

        delete songDataRepository[songid];
    }
}