import React, { useState, useEffect } from "react";
import { IProposal } from "./interfaces";
import ProposalForm from "./components/ProposalForm";
import { ContractContext } from "./ContractContext";
import ballotContractJson from "../public/contracts/BallotContract.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";
import Web3 from "web3";
import { BallotContract } from "../../types/web3-v1-contracts";
import ProposalListContainer from "./components/ProposalListContainer";
import config from "./constants";
interface AppProps {}

const App: React.FunctionComponent<AppProps> = () => {
  const { NETWORK_ID, NETWORK_URL } = config;

  const web3 = new Web3(Web3.givenProvider || NETWORK_URL);

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<BallotContract | null>(null);
  const [proposalList, setProposalList] = useState<IProposal[]>([]);

  async function getAccounts() {
    const accounts = await web3.eth.getAccounts();
    return setAccount(accounts[0]);
  }
  async function getBallotContract() {
    const contractAbi = ballotContractJson.abi as AbiItem[];
    const contractNetwork = ballotContractJson.networks[NETWORK_ID].address;
    const ballotContract = new web3.eth.Contract(
      contractAbi,
      contractNetwork
    ) as unknown as BallotContract;
    setContract(ballotContract);
  }

  async function getProposals() {
    if (!contract) return;
    const proposalCounter = await contract.methods.proposalCounter().call();
    const proposals: IProposal[] = await Promise.all(
      Array.from(
        { length: web3.utils.toNumber(proposalCounter) },
        (_, i) => i + 1
      ).map(async (i) => await contract.methods.proposals(i).call())
    );

    return setProposalList(
      proposalList.concat(
        proposals.sort(
          (a, b) =>
            web3.utils.toNumber(b.proposalId) -
            web3.utils.toNumber(a.proposalId)
        )
      )
    );
  }

  async function watchCreateProposal() {
    if (!contract) return;
    contract.events.ProposalCreated().on("data", async (event) => {
      setProposalList([event.returnValues, ...proposalList]);
    });
  }

  async function watchStateChange() {
    if (!contract) return;
    contract.events.VotingEnded().on("data", async (event) => {
      const proposalId = event.returnValues.proposalId;
      const updatedProposalList = proposalList.map((proposal) => {
        if (proposal.proposalId === proposalId) {
          return { ...proposal, state: "2" };
        }
        return proposal;
      });
      setProposalList(updatedProposalList);
    });
    contract.events.VotingStarted().on("data", async (event) => {
      const proposalId = event.returnValues.proposalId;
      const updatedProposalList = proposalList.map((proposal) => {
        if (proposal.proposalId === proposalId) {
          return { ...proposal, state: "1" };
        }
        return proposal;
      });
      setProposalList(updatedProposalList);
    });
  }

  watchCreateProposal();
  watchStateChange();
  useEffect(() => {
    getAccounts();
    getBallotContract();
  }, []);

  useEffect(() => {
    getProposals();
  }, [contract]);

  return (
    <div className="container py-5">
      <div className="row">
        <ContractContext.Provider value={{ account, contract }}>
          <ProposalForm />
          <ProposalListContainer proposalList={proposalList} />
        </ContractContext.Provider>
      </div>
    </div>
  );
};

export default App;
