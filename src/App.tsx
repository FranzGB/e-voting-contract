import React, {useState,useEffect} from 'react';
import { IProposal } from './interfaces';
import ProposalComponent from "./ProposalComponent";
import ProposalForm from "./ProposalForm";
import Web3 from 'web3';
const TruffleContract = require( '@truffle/contract' );
import BallotContract from '../build/contracts/BallotContract.json';
import * as R from 'ramda';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';


interface AppProps {

}

const App: React.FunctionComponent<AppProps> = ( ) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState({});
  const [proposalList, setProposalList] = useState<IProposal[]>([]);

  async function loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const network = await web3.eth.net.getNetworkType();
    console.log(network); // should give you main if you're connected to the main network via metamask...
    const accounts = await web3.eth.getAccounts();
    const ballotContract = TruffleContract(BallotContract);
    ballotContract.setProvider(Web3.givenProvider || "http://localhost:7545");
    const contractTemp = await ballotContract.deployed();
    setContract(contractTemp);
    setAccount(accounts[0]);
  }
  async function getProposals(contract:any){
    if (!(R.isEmpty(contract))){
      const proposalCounter = await contract.proposalCounter();
      const proposalCounterNumber:number = proposalCounter.toNumber();
      const proposals:IProposal[] = [];
      for (let i = 1; i <= proposalCounterNumber; i++) {
        const proposal:IProposal = await contract.proposals(i);
        proposals.push(proposal);
      }
      setProposalList(proposals);
    }
  }

  useEffect(() => {
    loadBlockChain()
    }
  , []);
  useEffect(() => {
    getProposals(contract);
  }, [contract]);

  return (
    <div className="container py-5">
        <div className="row">
            <ProposalForm account={account} contract={contract}/>
            <div className="col-md-8">
            {R.isEmpty(proposalList)?"Loading...":proposalList.map(
              (proposal,idx) => <ProposalComponent account={account} proposal={proposal} key={idx} contract={contract}/>)
            }
            </div>
        </div>
    </div>
  );
};

export default App;
