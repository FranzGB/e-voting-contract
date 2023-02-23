import React from "react";

export interface IProposal {
  createdAt: string;
  creatorAddress: string;
  description: string;
  officialName: string;
  proposalId: string;
  status: string;
}
interface IStatus {
  [idx: string]: { title: string; badge: JSX.Element };
}
export const Status: IStatus = {
  0: {
    title: "Created",
    badge: <span className="badge bg-success">Created</span>,
  },
  1: {
    title: "Voting",
    badge: <span className="badge bg-primary">In progress</span>,
  },
  2: { title: "Ended", badge: <span className="badge bg-danger">Ended</span> },
};
