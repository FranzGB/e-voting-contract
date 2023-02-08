import React, { useState, useEffect } from "react";
import { IProposal, Status } from "../interfaces";
import ConfirmationModal from "./ConfirmationModal";
import web3 from "web3";
interface ProposalComponentProps {
  account: string;
  proposal: IProposal;
  contract: any;
}

const ProposalComponent: React.FunctionComponent<ProposalComponentProps> = ({
  account,
  proposal,
  contract,
}) => {
  const {
    proposalId,
    officialName,
    creatorAddress,
    createdAt,
    description,
    status,
  } = proposal;
  const dateCreated = new Date(web3.utils.toNumber(createdAt) * 1000);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [fun, setFun] = useState<() => void>();
  const [count, setCount] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getProposalCounters = async (
    contract: any,
    proposalId: string,
  ) => {
    const counter = await contract.proposalCounter();
    const counters:{} = await contract.helperCounters(web3.utils.toNumber(proposalId));
    console.log(counters);
  }
  const registerVoter = async (
    contract: any,
    proposalId: string,
    account: string
  ) => {
    contract.addVoter(proposalId, account, "John Doe", {
      from: account,
    });
  };
  const initiateVote = async (
    contract: any,
    proposalId: string,
    account: string
  ) => {
    contract.startVote(proposalId, {
      from: account,
    });
  };
  const castVote = async (
    contract: any,
    proposalId: string,
    account: string
  ) => {
    contract.doVote(proposalId, true, {
      from: account,
    });
  };
  const endVote = async (
    contract: any,
    proposalId: string,
    account: string
  ) => {
    contract.endVote(proposalId, {
      from: account,
    });
  };
  const messages = {
    Initiate:
      "Are you sure you want to initiate the vote casting? Users will not be able to register on the electoral roll any more.",
    Register:
      "Are you sure you want to register on this proposal to cast a vote when it begins?",
    Vote: "Are you in support or against this proposal?",
    End: "Are you sure you want to end the vote on this proposal?",
  };
  useEffect(() => {
    getProposalCounters(contract, proposalId);
  }, [count]);
  return (
    <>
      <ConfirmationModal
        show={show}
        handleClose={handleClose}
        handleSubmit={fun!}
        message={message}
      />
      <div className="card bg-dark rounded-0 mb-2">
        <div className="card-header d-flex flex-column justify-content-between align-items-start">
          <span className="fw-bold align-self-center">{officialName}</span>
          <span className="fw-light fst-italic creator-info">
            Created by: {creatorAddress} at {dateCreated.toDateString()}{" "}
          </span>
          <span className="fw-light d-block">
            Status: {Status[status].badge}
          </span>
        </div>
        <div className="card-body">
          <span className="d-block my-2">{description}</span>
          {Status[status].title == "Ended" && <span>
            Total count: {JSON.stringify(count)}
            </span>}
          <div className="d-flex row justify-content-around">
            <button
              className="col-2 btn btn-success"
              disabled={!(status == 0 && account == creatorAddress)}
              onClick={() => {
                setMessage(messages.Register);
                setFun(
                  () => () => registerVoter(contract, proposalId, account)
                );
                handleShow();
              }}
            >
              Initiate
            </button>
            <button
              className="col-2 btn btn-warning"
              disabled={!(status == 0)}
              onClick={() => {
                setMessage(messages.Register);
                setFun(() => () => initiateVote(contract, proposalId, account));
                handleShow();
              }}
            >
              Register
            </button>
            <button
              className="col-2 btn btn-info"
              disabled={!(status == 1)}
              onClick={() => {
                setMessage(messages.Vote);
                setFun(() => () => castVote(contract, proposalId, account));
                handleShow();
              }}
            >
              Vote
            </button>
            <button
              className="col-2 btn btn-danger"
              disabled={!(status == 1 && account == creatorAddress)}
              onClick={() => {
                setMessage(messages.End);
                setFun(() => () => endVote(contract, proposalId, account));
                handleShow();
              }}
            >
              End
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalComponent;
