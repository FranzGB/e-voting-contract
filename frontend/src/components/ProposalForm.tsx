import React, { useContext, useState } from "react";

import { ContractContext } from "../ContractContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot } from "@fortawesome/free-solid-svg-icons";

interface ProposalFormProps {}
const ProposalForm: React.FunctionComponent<ProposalFormProps> = () => {
  const { account, contract } = useContext(ContractContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function createProposal(title: string, description: string) {
    if (!contract) return;
    contract.methods
      .createProposal(title, description)
      .send({ from: account })
      .then((_: any) => {
        clearFields();
      });
    return;
  }

  const clearFields = () => {
    setTitle("");
    setDescription("");
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div className="col-md-4">
      <div className="card card-body rounded-1 mb-4 bg-dark">
        <h1>
          E-Voting Platform <FontAwesomeIcon icon={faCheckToSlot} />
        </h1>
        <span>Wallet</span>
        <span id="account" className="text-muted text-nowrap">
          {account}
        </span>
      </div>
      <form
        action=""
        className="card card-body bg-dark rounded-1"
        id="proposalForm"
        onSubmit={onSubmit}
      >
        <h4>Write a Proposal</h4>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="form-control bg-dark text-white border-0 my-4"
          value={title}
          onInput={(e) => setTitle(e.currentTarget.value)}
        />
        <textarea
          name="description"
          placeholder="Explain your idea"
          rows={20}
          className="form-control bg-dark text-white border-0 my-4"
          value={description}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => createProposal(title, description)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;
