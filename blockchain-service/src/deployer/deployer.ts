//https://docs.soliditylang.org/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
import web3 from 'web3';
import fs from 'fs';

export default class SmartContractDeployer {
    private contractAbi: any;

    private contractByteCode: any;

    private account: any;

    private web3Provider: web3;

    private static DeployerIntance: SmartContractDeployer;

    private constructor() {

        //connect web3 to truffle
        this.web3Provider = new web3('http://127.0.0.1:7545');

        const contractJson = fs.readFileSync('./build/contracts/Songs.json', 'utf8');

        const { abi, bytecode } = JSON.parse(contractJson);

        //extract abi and bytecode
        this.contractAbi = abi;
        this.contractByteCode = bytecode;

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

    async deploySmartContract(): Promise<string> {

        //ensure this.account is defined
        if (!this.account) {
            const [ ownerAccount ] = await this.web3Provider.eth.getAccounts();
            this.account = ownerAccount;
        }
        
        //TODO: Determine proper gas amount
        const result = await new this.web3Provider.eth.Contract(this.contractAbi)
            .deploy({ data: this.contractByteCode })
            .send({ from: this.account, gas: '1000000' });
        
        if (!result.options.address) {
            throw new Error('Unable to deploy smart contract');
        }
        
        return result.options.address;
    }
}