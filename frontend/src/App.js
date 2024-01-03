import './App.css';
import idl from "./idl.json"
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {Program, AnchorProvider, web3, utils, BN} from '@project-serum/anchor'
import {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
window.Buffer = Buffer;

const { Link } = require('react-router-dom'); // Import Link from react-router-dom

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {preflightCommitment: "processed"};
const {SystemProgram} = web3;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([])
  const [donationAmount, setDonationAmount] = useState(0.1); // Default donation amount

  const handleAmountChange = (event) => {
    setDonationAmount(parseFloat(event.target.value) || 0);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
    return provider;
  }

  const checkIfWalletConnected = async() => {
    try{
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom){
          console.log("Phantom wallet is installed!");
          const response = await solana.connect({
            onlyIfTrusted: true, 
          });
          console.log("Connected with pub key: ", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        }
        else{
          console.log("Solana not found");
        }
      }
    }catch(error){
      console.error(error)
    }
  };

  const connectWallet = async() => {
    const {solana} = window
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with pub key: ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString())
    }
  };

  const getCampaigns = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    Promise.all(
      (await connection.getProgramAccounts(programID)).map(
        async (campaign) => ({
        ...(await program.account.campaign.fetch(campaign.pubkey)),
        pubkey: campaign.pubkey,
        })
      )
    ).then ((campaigns) => setCampaigns(campaigns))
  };

  const createCampaign = async () => {
    try{
      const provider = getProvider()  
      const program = new Program(idl, programID, provider)
      const [campaign] = await PublicKey.findProgramAddressSync([
        utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId,
      console.log("Program ID:", programID.toString())

      );
      await program.rpc.create(
        utils.bytes.utf8.encode("campaign name"),
        utils.bytes.utf8.encode("campaign description"),
        {
          accounts: {
            campaign,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
      })
      console.log("Created a new campaign with address: ", campaign.toString());
    }catch(error){
      console.error('Eror creating campaign', error)
    }
  }

  const donate = async publicKey => {
    try{
      const provider = getProvider();
      const program = new Program(idl, programID, provider)

      await program.rpc.donate(new BN(donationAmount  * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
      });
      console.log(`Donated ${donationAmount} SOL to: `, publicKey.toString());
      getCampaigns();
    }catch(error){

    }
  }

  const withdraw = async (publicKey) =>{
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider)

      await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Withdrew money from: ", publicKey.toString());
      getCampaigns();
    }catch(error){
      console.log("Error with withdrawal:", error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Wallet</button>
  );

  const renderConnectedContainer = () => {
     
    return(
    <>
      <button onClick={createCampaign}>Create a campaign</button>
      <button onClick={getCampaigns}>Get a list of campaigns</button>
      <br />
      <div className="card-wrapper">
        {campaigns.map((campaign) => {
          const dataToPass = { name: campaign.name, description: campaign.description, pubkey: campaign.pubkey.toString() };

          return (
          <div key={campaign.pubkey} className="card">
            <p>
              <b>Campaign ID: </b>
            </p>
            {campaign.pubkey.toString()}
            <p>
              <b>Balance: {" "} </b> {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()}
            </p>
            <p>
              <b>{campaign.name}</b>
            </p>
            <p>{campaign.description}</p>
            
            { /* Use Link to navigate to the campaign page */}
            <Link to={`/campaigns/${campaign.pubkey}`} state={dataToPass}>
  <button className='view'>View Campaign</button>
</Link>

            <button className='donate' onClick={() => donate(campaign.pubkey)}>Click to DONATE!</button>
            <button className='withdraw' onClick={() => withdraw(campaign.pubkey)}>Click to WITHDRAW!</button>
            <br />
          </div>
        )})}
      </div>
    </>
    )
  };



  useEffect(() => {
    const onLoad = async() =>{
      await checkIfWalletConnected();
      console.log("hello");
    }
    window.addEventListener('load', onLoad);
    return() => window.removeEventListener('load', onLoad);
  }, []);

  return <div className='App'>
    {!walletAddress && renderNotConnectedContainer()}
    {walletAddress && renderConnectedContainer()}
    <input type='text' name='name' placeholder='name'></input>
    <input
        type='text'
        name='amount'
        placeholder='amount'
        value={donationAmount}
        onChange={handleAmountChange}
      ></input>
  </div>
};

export default App;
