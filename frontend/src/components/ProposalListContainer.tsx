import * as R from 'ramda';
import React, { useEffect } from 'react';

import { IProposal } from '../interfaces';
import ProposalComponent from './ProposalComponent';

interface ProposalListContainerProps {
  proposalList: IProposal[];
  onRemoved: (proposalId: string) => void;
}

const ProposalListContainer: React.FunctionComponent<
  ProposalListContainerProps
> = ({ proposalList, onRemoved }) => {
  const [proposalListState, setProposalListState] =
    React.useState<IProposal[]>(proposalList);

  useEffect(() => {
    setProposalListState(
      R.filter(
        (proposal: IProposal) => proposal.officialName !== "",
        proposalList
      )
    );
  }, [proposalList]);

  return (
    <div className="col-md-8">
      {R.isEmpty(proposalList)
        ? "Loading..."
        : proposalListState.map((proposal, idx) => (
            <ProposalComponent
              proposal={proposal}
              key={idx}
              onRemoved={onRemoved}
            />
          ))}
    </div>
  );
};

export default ProposalListContainer;
