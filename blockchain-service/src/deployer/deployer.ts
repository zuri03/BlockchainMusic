//https://docs.soliditylang.org/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
import solc from 'solc';
import web3 from 'web3';
import fs from 'fs';

export const deploySmartContract = function (): string | undefined {
    return undefined;
}

const compileSolidityContract = function () {
    
}

let deployer: SmartContractDeployer;


class SmartContractDeployer {
    //contract field: holds the contract object to be repeatedely deployed to network
    private contract

    //web3: web3 instance for interacting with ethereum network
    private web3Provider

    constructor() {

        //connect web3 to truffle
        
        const contractByteContent = fs.readFileSync('../../contracts/Songs.sol', 'utf8');

        const compilerInput = {
            language: 'Solidity',
            sources: {
                'Songs.sol': { contractByteContent }
            },
            settings: {
                outputSelection: { '*': { '*': ['*'] } }
            }
        }

        const { contracts } = JSON.parse(solc.compile(JSON.stringify(compilerInput)));

        this.contract = contracts['Songs.sol']['Songs'];

    }
    

    deploySmartContract(): string {
        return ''
    }
}