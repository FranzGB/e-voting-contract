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
import { Button } from "react-bootstrap";
interface AppProps {}

const App: React.FunctionComponent<AppProps> = () => {
  const { NETWORK_ID, NETWORK_URL } = config;

  const web3 = new Web3(Web3.givenProvider || NETWORK_URL);

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<BallotContract | null>(null);
  const [proposalList, setProposalList] = useState<IProposal[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: "eth_requestAccounts" }).then(() => {
        setIsConnected(true);
      });
    }
  }

  async function getAccounts() {
    if (!isConnected) return;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  async function getBallotContract() {
    if (!isConnected) return;
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
        { length: Number.parseInt(proposalCounter) },
        (_, i) => i + 1
      ).map(async (i) => await contract.methods.proposals(i).call())
    );
    const sortedProposals = proposals.sort(
      (a, b) => Number.parseInt(b.proposalId) - Number.parseInt(a.proposalId)
    );
    setProposalList(proposalList.concat(sortedProposals));
  }

  function handleProposalRemoved(proposalId: string) {
    console.log("handling proposal removed");
    setProposalList(
      proposalList.filter((proposal) => proposal.proposalId !== proposalId)
    );
  }

  useEffect(() => {
    getAccounts();
    getBallotContract();
  }, [isConnected]);

  useEffect(() => {
    getProposals();
  }, [contract]);

  useEffect(() => {
    if (!contract) return;
    contract.events.ProposalCreated().once("data", async (event) => {
      setProposalList([event.returnValues, ...proposalList]);
    });

    contract.events.VotingEnded().once("data", async (event) => {
      const proposalId = event.returnValues.proposalId;
      const updatedProposalList = proposalList.map((proposal) => {
        if (proposal.proposalId === proposalId) {
          return { ...proposal, status: "2" };
        }
        return proposal;
      });
      setProposalList(updatedProposalList);
    });

    contract.events.VotingStarted().once("data", async (event) => {
      const proposalId = event.returnValues.proposalId;
      const updatedProposalList = proposalList.map((proposal) => {
        if (proposal.proposalId === proposalId) {
          return { ...proposal, status: "1" };
        }
        return proposal;
      });
      setProposalList(updatedProposalList);
    });
  }, [contract, proposalList]);

  return (
    <div className="container py-5">
      <div className="row">
        {isConnected ? (
          <ContractContext.Provider value={{ account, contract }}>
            <ProposalForm />
            <ProposalListContainer
              proposalList={proposalList}
              onRemoved={handleProposalRemoved}
            />
          </ContractContext.Provider>
        ) : (
          <Button onClick={connectWallet}>Connect to MetaMask</Button>
        )}
      </div>
    </div>
  );
};

export default App;
