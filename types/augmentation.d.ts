import { BallotContractInstance } from "./truffle-contracts";

declare module "mocha" {
  export interface Suite {
    ballotContract: BallotContractInstance;
  }
}
