import React, { createContext } from 'react';
import { BallotContract } from '../types/web3-v1-contracts';


interface ContractContextProps {
  account: string;
  contract: BallotContract | null;
}
export const ContractContext = createContext<ContractContextProps>({
  account: '',
  contract: null,
});
