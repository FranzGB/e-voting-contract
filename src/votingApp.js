import ballotContract from '../build/contracts/BallotContract.json';
import { default as contract } from 'truffle-contract';

export const App = {
  contracts: {},
  web3Provider: '',
  init: async () => {
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
    // await App.renderProposals();
    console.log('Loaded');
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      console.log('Ethereum is installed');
      App.web3Provider = window.ethereum;
      await App.web3Provider.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('No ethereum browser is installed. Try installing metamask browser extension.');
    }
  },
  loadAccount: async () => {
    const accounts = await App.web3Provider.request({ method: 'eth_requestAccounts' });
    App.account = accounts[0];
    App.render();
  },

  loadContracts: async () => {
    App.contracts.ballotContract = contract(ballotContract);
    App.contracts.ballotContract.setProvider(App.web3Provider);
    App.ballotContract = await App.contracts.ballotContract.deployed();
  },
  render: () => {
    document.getElementById('account').innerText = App.account;
  },
  getProposals: async () => {
    console.log(App.ballotContract);
    const proposalCounter = await App.ballotContract.proposalCounter();
    const proposalCounterNumber = proposalCounter.toNumber();
    const proposals = [];
    for (let i = 1; i <= proposalCounterNumber; i++) {
      const proposal = await App.ballotContract.proposals(i);
      proposals.push(proposal);
    }
    return proposals;
  },
  // renderProposals: async () => {
  //   const proposalCounter = await App.ballotContract.proposalCounter();
  //   const proposalCounterNumber = proposalCounter.toNumber();
  //   let html = '';
  //   for (let i = 1; i <= proposalCounterNumber; i++) {
  //     const proposal = await App.ballotContract.proposals(i);
  //     const { creatorAddress, proposalId, officialName, description, createdAt, status } = proposal;
  //     const proposalElement = `
  //       <div class="card bg-dark rounded-0 mb-2">
  //         <div class="card-header d-flex flex-column justify-content-between align-items-start">
  //           <span class= "fw-bold align-self-center">${officialName}</span>
  //           <span class="fw-light fst-italic creator-info">Created by: ${creatorAddress} at ${createdAt}</span>
  //         </div>
  //         <div class="card-body">
  //           <span> ${description}</span>
  //         </div>
  //       </div>
  //     `;
  //     html += proposalElement;
  //   };
  //   document.querySelector('#proposalList').innerHTML = html;
  // },
  createProposal: async (title, description) => {
    const result = await App.ballotContract.createProposal(title, description, {
      from: App.account
    });
    console.log(result.logs[0]);
  }
};
