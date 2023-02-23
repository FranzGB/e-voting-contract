import React, { useState, useEffect, useContext } from "react";
import { IProposal, Status } from "../interfaces";
import ConfirmationModal from "./ConfirmationModal";
import web3 from "web3";
import { ContractContext } from "../ContractContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
interface ProposalComponentProps {
  proposal: IProposal;
}

const ProposalComponent: React.FC<ProposalComponentProps> = ({ proposal }) => {
  const {
    proposalId,
    officialName,
    creatorAddress,
    createdAt,
    description,
    status,
  } = proposal;

  const { account, contract } = useContext(ContractContext);
  const dateCreated = new Date(web3.utils.toNumber(createdAt) * 1000);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [fun, setFun] = useState<() => void>();
  const [count, setCount] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getProposalCounters = async () => {
    if (!contract) return;
    const counters: {} = await contract.methods
      .helperCounters(web3.utils.toNumber(proposalId))
      .call();
  };
  const registerVoter = async () => {
    if (!contract) return;
    return contract.methods.addVoter(proposalId, account, "John Doe").send({
      from: account,
    });
  };
  const initiateVote = async () => {
    if (!contract) return;
    return contract.methods.startVote(proposalId).send({
      from: account,
    });
  };
  const castVote = async (choice: boolean) => {
    if (!contract) return;
    return contract.methods.doVote(proposalId, choice).send({
      from: account,
    });
  };
  const endVote = async () => {
    if (!contract) return;
    return contract.methods.endVote(proposalId).send({
      from: account,
    });
  };

  const messages = {
    Initiate:
      "Confirm initiation of vote casting. No further registrations will be allowed on the electoral roll.",
    Register: "Confirm your registration to cast a vote when voting begins.",
    Vote: "Choose whether you support or oppose this proposal.",
    End: "Confirm ending of voting on this proposal.",
  };

  const removeProposal = async () => {
    if (!contract) return;
    return contract.methods.deleteProposal(proposalId).send({
      from: account,
    });
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
      <div className="card bg-dark rounded-0 mb-2 container">
        <div className="card-header d-flex align-items-start row">
          <div className="d-flex flex-column col-11">
            <span className="fw-bold align-self-center">{officialName}</span>
            <span className="fw-light fst-italic creator-info">
              Created by: {creatorAddress} at {dateCreated.toDateString()}
            </span>
            <span className="fw-light d-block">
              Status: {Status[status].badge}
            </span>
          </div>
          <button
            className="btn btn-sm btn-danger align-self-center col-1"
            disabled={!(account == creatorAddress) || !(status == "0")}
            onClick={() => {
              setMessage("Confirm removal of this proposal.");
              setFun(() => () => removeProposal());
              handleShow();
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
        <div className="card-body">
          <span className="d-block my-2">{description}</span>
          {Status[status].title == "Ended" && <span>Total count: {}</span>}
          <div className="d-flex row justify-content-around">
            {!(account == creatorAddress) || status == "0" && (
              <button
                className="col-4 btn btn-success"
                disabled={!(account == creatorAddress)}
                onClick={() => {
                  setMessage(messages.Initiate);
                  setFun(() => () => initiateVote());
                  handleShow();
                }}
              >
                Initiate
              </button>
            )}
            {status == "0" && (
              <button
                className="col-4 btn btn-warning"
                onClick={() => {
                  setMessage(messages.Register);
                  setFun(() => () => registerVoter());
                  handleShow();
                }}
              >
                Register
              </button>
            )}
            {status == "1" && (
              <button
                className="col-4 btn btn-info"
                disabled={false}
                onClick={() => {
                  setMessage(messages.Vote);
                  setFun(() => () => castVote(true));
                  handleShow();
                }}
              >
                Vote
              </button>
            )}
            {!(account == creatorAddress) || status == "1" && (
              <button
                className="col-4 btn btn-danger"
                disabled={!(account == creatorAddress)}
                onClick={() => {
                  setMessage(messages.End);
                  setFun(() => () => endVote());
                  handleShow();
                }}
              >
                End
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalComponent;
