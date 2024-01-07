// SimplePage.js
import React from "react";
import idl from "./../idl.json";
import "./campaignpage.css";
import { useLocation } from "react-router-dom";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const { SystemProgram } = web3;

const SimplePage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [donationAmount, setDonationAmount] = useState(0.1); // Default donation amount

  const handleAmountChange = (event) => {
    const inputValue = event.target.value;

    // Replace commas with dots
    const formattedValue = inputValue.replace(/,/g, ".");

    // Update the state with the formatted value
    setDonationAmount(formattedValue);
  };

  const location = useLocation();
  const passedData = location.state;

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const getAdminAddress = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("admin");
    const adminAddress = await program.rpc.getAdmin({
      accounts: {
        campaign: passedData.pubkey,
      },
    });
  
    console.log("Admin Address:", adminAddress.toString());
    // Set the admin address to your state or use it as needed in your component
  };

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
    ).then((campaigns) => setCampaigns(campaigns));
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.donate(new BN(donationAmount * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log(`Donated ${donationAmount} SOL to: `, publicKey.toString());
      getCampaigns();
    } catch (error) {}
  };

  const withdraw = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Withdrew money from: ", publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.log("Error with withdrawal:", error);
    }
  };

  useEffect(() => {
    const onLoad = async() =>{
      await checkIfWalletConnected();
      getAdminAddress();
     
    }
    window.addEventListener('load', onLoad);
    getCampaigns()
    return() => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="campaign-image-wrapper">
        <div className="campaign-image">Hello</div>
      </div>

      <div className="info-wrapper">
        <div className="data-passed-wrapper">
          <div className="data-passed">
            {passedData ? (
              <>
                <h1>Name: {passedData.name}</h1>
                <p>Public key: {passedData.pubkey}</p>
                <p>Description: {passedData.description}</p>
              </>
            ) : (
              <p>No data passed.</p>
            )}
          </div>
        </div>

        {passedData.pubkey === "GZQZJ7BzvvEdEJFBQ4oBiKFSHGh7H5jXqjVoPYCL2PK1" && (
    console.log("YES")
  
)}
        <div className="">
          <div className="input-wrapper">
            <input
              className="amount-input"
              type="number"
              name="amount"
              placeholder="amount"
              step={0.01}
              value={donationAmount}
              onChange={handleAmountChange}
              min="0"
            ></input>
          </div>
          <div className="buttons-wrapper">
            <button
              className="donate"
              onClick={() => donate(passedData.pubkey)}
            >
              Click to DONATE!
            </button>
            <button
              className="withdraw"
              onClick={() => withdraw(passedData.pubkey)}
            >
              Click to WITHDRAW!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;
