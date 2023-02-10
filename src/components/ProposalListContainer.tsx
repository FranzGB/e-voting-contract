import React from 'react'
import * as R from 'ramda'
import ProposalComponent from './ProposalComponent'
import { IProposal } from '../interfaces'

interface ProposalListContainerProps {
  proposalList: IProposal[];
}
const ProposalListContainer:React.FunctionComponent<ProposalListContainerProps> = ({ proposalList }) => {
  return (
    <div className="col-md-8">
    {R.isEmpty(proposalList)?"Loading...":proposalList.map(
      (proposal,idx) => <ProposalComponent proposal={proposal} key={idx} />)
    }
    </div>
  )
}

export default ProposalListContainer
