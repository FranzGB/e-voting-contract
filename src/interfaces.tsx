
export interface IProposal {
  createdAt: number;
  creatorAddress: string;
  description: string;
  officialName: string;
  proposalId: string;
  status: number;
};
interface IStatus<>{
  [idx:string]: {title: string, badge: JSX.Element};
}
export const Status:IStatus = {
  0:{title: "Created",
  badge: <span className="badge bg-primary">Created</span>
},
  1: {title: "Voting",
  badge: <span className="badge bg-success">Voting</span>
},
  2: {title: "Ended",
  badge: <span className="badge bg-danger">Ended</span>
},
}
