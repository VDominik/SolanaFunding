import './Create.css'
import idl from "./../idl.json"
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {Program, AnchorProvider, web3, utils, BN} from '@project-serum/anchor'
import {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
window.Buffer = Buffer;

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {preflightCommitment: "processed"};
const {SystemProgram} = web3;

const Create = () =>{

    

    const [walletAddress, setWalletAddress] = useState(null);
    const [campaigns, setCampaigns] = useState([])
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');

    
  const handleCampaignNameChange = (event) => {
    setCampaignName(event.target.value);
  };

  const handleCampaignDescriptionChange = (event) => {
    setCampaignDescription(event.target.value);
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
        utils.bytes.utf8.encode(campaignName),
        utils.bytes.utf8.encode(campaignDescription),
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

  useEffect(() => {
    const onLoad = async() =>{
      await checkIfWalletConnected();
    }
    window.addEventListener('load', onLoad);
    return() => window.removeEventListener('load', onLoad);
  }, []);

    return <>
        <div className='create-container'>
      <h2>Create Campaign</h2>
      <label>
        Campaign Name:
        <input
          type='text'
          name='campaignName'
          value={campaignName}
          onChange={handleCampaignNameChange}
        />
      </label>
      <br />
      <label>
        Campaign Description:
        <textarea
          name='campaignDescription'
          value={campaignDescription}
          onChange={handleCampaignDescriptionChange}
        />
      </label>
      <br />
      <button onClick={createCampaign}>Create Campaign</button>
    </div>
    </>
}

export default Create