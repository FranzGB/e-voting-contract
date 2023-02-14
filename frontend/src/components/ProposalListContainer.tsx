import React, { useEffect } from "react";
import * as R from "ramda";
import ProposalComponent from "./ProposalComponent";
import { IProposal } from "../interfaces";

interface ProposalListContainerProps {
  proposalList: IProposal[];
}

const ProposalListContainer: React.FunctionComponent<
  ProposalListContainerProps
> = ({ proposalList }) => {
  const [proposalListState, setProposalListState] =
    React.useState<IProposal[]>(proposalList);

  useEffect(() => {
    setProposalListState(
      R.filter((proposal:IProposal) => proposal.officialName !== "", proposalList)
    );
  }, [proposalList]);

  return (
    <div className="col-md-8">
      {R.isEmpty(proposalList)
        ? "Loading..."
        : proposalListState.map((proposal, idx) => (
            <ProposalComponent proposal={proposal} key={idx} />
          ))}
    </div>
  );
};

export default ProposalListContainer;
