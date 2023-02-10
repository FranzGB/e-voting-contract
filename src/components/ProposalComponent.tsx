import React, { useState, useEffect, useContext } from "react";
import { IProposal, Status } from "../interfaces";
import ConfirmationModal from "./ConfirmationModal";
import web3 from "web3";
import { ContractContext } from "../ContractContext";
interface ProposalComponentProps {
  proposal: IProposal;
}

const ProposalComponent: React.FunctionComponent<ProposalComponentProps> = ({
  proposal
}) => {
  const {
    proposalId,
    officialName,
    creatorAddress,
    createdAt,
    description,
    status,
  } = proposal;
  const {account, contract} = useContext(ContractContext);
  const dateCreated = new Date(web3.utils.toNumber(createdAt) * 1000);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [fun, setFun] = useState<() => void>();
  const [count, setCount] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getProposalCounters = async () => {
    if (!contract) return;
    const counters:{} = await contract.methods.helperCounters(web3.utils.toNumber(proposalId)).call();
  }
  const registerVoter = async () => {
    if (!contract) return;
    return contract.methods.addVoter(proposalId, account, "John Doe").call();
  };
  const initiateVote = async () => {
    if (!contract) return;
    return contract.methods.startVote(proposalId).call(
      {
        from: account
      }
    );
  };
  const castVote = async (choice: boolean) => {

    if (!contract) return;
    return contract.methods.doVote(proposalId, choice).call();
  };
  const endVote = async () => {
    if (!contract) return;
    return contract.methods.endVote(proposalId).call();
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
    getProposalCounters();
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
              disabled={!(status == "Created")}
              onClick={() => {
                setMessage(messages.Register);
                setFun(
                  () => () => registerVoter()
                );
                handleShow();
              }}
            >
              Initiate
            </button>
            <button
              className="col-2 btn btn-warning"
              disabled={!(status == "0")}
              onClick={() => {
                setMessage(messages.Register);
                setFun(() => () => initiateVote());
                handleShow();
              }}
            >
              Register
            </button>
            <button
              className="col-2 btn btn-info"
              disabled={!(status == "1")}
              onClick={() => {
                setMessage(messages.Vote);
                setFun(() => () => castVote(true));
                handleShow();
              }}
            >
              Vote
            </button>
            <button
              className="col-2 btn btn-danger"
              disabled={!(status == "1" && account == creatorAddress)}
              onClick={() => {
                setMessage(messages.End);
                setFun(() => () => endVote());
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
