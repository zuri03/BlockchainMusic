//https://docs.soliditylang.org/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
import solc from 'solc'
import web3 from 'web3';
import fs from 'fs';

export default class SmartContractDeployer {
    private contractAbi: any;

    private contractByteCode: any;

    private account: any;

    //web3: web3 instance for interacting with ethereum network
    private web3Provider: web3;

    static DeployerIntance: SmartContractDeployer;

    private constructor() {

        //connect web3 to truffle
        this.web3Provider = new web3('http://127.0.0.1:7545');

        //read contract
        const contractByteContent = fs.readFileSync('../../contracts/Songs.sol', 'utf8');

        const compilerInput = {
            language: 'Solidity',
            sources: {
                'Songs.sol': { content: contractByteContent }
            },
            settings: {
                outputSelection: { '*': { '*': ['*'] } }
            }
        }

        //compile
        const { contracts } = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
        const contract = contracts['Songs.sol']['Songs'];

        //extract abi and bytecode
        this.contractAbi = contract['abi'];
        this.contractByteCode = contract['evm']['bytecode']['object'];

        //get the first account
        this.web3Provider.eth.getAccounts()
            .then(accounts => this.account = accounts[0]);
    }

    static getDeployerInstance(): SmartContractDeployer {
        if (!this.DeployerIntance) {
            this.DeployerIntance = new SmartContractDeployer();
        }

        return this.DeployerIntance;
    }

    async deploySmartContract(): Promise<string | undefined> {

        //ensure this.account is defined
        if (!this.account) {
            const [ ownerAccount ] = await this.web3Provider.eth.getAccounts();
            this.account = ownerAccount;
        }

        const result = await new this.web3Provider.eth.Contract(this.contractAbi)
            .deploy({ data: this.contractByteCode })
            .send({ from: this.account, gas: '1000000' });
            
        return result.options.address;
    }
}