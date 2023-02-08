import React, { useState } from 'react';

interface ProposalFormProps {
  account: string;
  contract: any;
}

const ProposalForm: React.FunctionComponent<ProposalFormProps> = ({account, contract}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  async function createProposal(title:string, description:string, contract:any, account: string) {
    console.log("Title: ", title,"Desc: ", description)
    contract.createProposal(title, description, {
      from: account
    });
  }
  const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  };

  return (
    <div className="col-md-4">
      <div className="card card-body rounded-1 mb-4 bg-dark">
        <h1>E-Voting Platform</h1>
        <span>Wallet</span>
        <span id="account">{account}</span>
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
          onInput={e => setTitle(e.currentTarget.value)}
        />
        <textarea
          name="description"
          placeholder="Explain your idea"
          rows={10}
          className="form-control bg-dark text-white border-0 my-4"
          value={description}
          onInput={e => setDescription(e.currentTarget.value)}
        />
        <button className="btn btn-primary" onClick={() => createProposal(title,description,contract,account)}>Save</button>
      </form>
    </div>
  );
};

export default ProposalForm;
