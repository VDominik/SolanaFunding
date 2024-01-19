// SimplePage.js
import React from "react";
import idl from "./../idl.json";
import "./campaignpage.css";
import { useLocation } from "react-router-dom";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useParams } from 'react-router-dom';
const { Link } = require("react-router-dom"); // Import Link from react-router-dom


const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const { SystemProgram } = web3;

const SimplePage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [amount, setamount] = useState(0.1); // Default donation amount
  const params = useParams();
  const campaignId = params.campaignId;
  const [campaignInfo, setCampaignInfo] = useState({
    admin: null,
    campaignName: null,
    campaignDescription: null,
  });
  const [loading, setLoading] = useState(true);

  const handleAmountChange = (event) => {
    const inputValue = event.target.value;

    // Replace commas with dots
    const formattedValue = inputValue.replace(/,/g, ".");

    // Update the state with the formatted value
    setamount(formattedValue);
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

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet is installed!");
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log(
            "Connected with pub key: ",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        } else {
          console.log("Solana not found");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCampaignById = async (campaignId) => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
  
    const campaignAccount = await program.account.campaign.fetch(new PublicKey(campaignId));
    const admin = campaignAccount.admin.toString();
    const campaignName = campaignAccount.name;
    const campaignDescription = campaignAccount.description;
    var outputElement = document.getElementById('testid');
    var htmlString = '<h1>Hello, World!</h1><p>This is some rendered HTML.</p>';
    outputElement.innerHTML = campaignDescription;
  
    // console.log("Admin inside getCampaignById:", admin);
  
    return { admin, campaignName, campaignDescription };
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.donate(new BN(amount * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log(`Donated ${amount} SOL to: `, publicKey.toString());
      getCampaignById(campaignId);
    } catch (error) {}
  };

  const withdraw = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.withdraw(new BN(amount * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Withdrew money from: ", publicKey.toString());
      getCampaignById(campaignId);
    } catch (error) {
      console.log("Error with withdrawal:", error);
    }
  };

  const renderDonateButton = () => {
    return (
      <button className="donate" onClick={() => donate(campaignId)}>
        Click to DONATE!
      </button>
    );
  };

  const renderAmountInput = () => {
    return (
      <div className="input-wrapper">
        <input
          className="amount-input"
          type="number"
          name="amount"
          placeholder="amount"
          step={0.01}
          value={amount}
          onChange={handleAmountChange}
          min="0"
        ></input>
      </div>
    );
  };

  const renderWithdrawButton = () => {
    return (
      <button className="withdraw" onClick={() => withdraw(campaignId)}>
        Click to WITHDRAW!
      </button>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
      if (campaignId) {
        const { admin, campaignName, campaignDescription } = await getCampaignById(campaignId);
        // console.log("Admin inside useEffect:", admin);
        setLoading(false);
        setCampaignInfo({ admin, campaignName, campaignDescription });
        // Now you can use admin, campaignName, campaignDescription as needed
      }
    };
    onLoad();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [campaignId]);
  



  return (
    <>
    <div className="breadcrumbs">
    <Link to={`/App`}>
      <span>&lt;&lt; Back</span>
    </Link>
    </div>
    <div className="page-wrapper">
      <div className="campaign-image-wrapper">
        <div className="campaign-image">
        <img src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaignId}`} 
                alt=""/>
        </div>
      </div>

      <div className="info-wrapper">
        <div className="data-passed-wrapper">
        <div className="data-passed">
        {loading ? (
      <p>Loading...</p>
      ) : (
        <>
          {campaignInfo.admin && (
            <>
              <h1>Name: {campaignInfo.campaignName}</h1>
              <p>Public key: {campaignId}</p>
              <p>Description:</p>
            </>
            
          )}
  
        </>
      )}
      <div id="testid">Description: {campaignInfo.campaignDescription}</div>
      </div>
        </div>

        {/* Fixing the syntax issue and wrapping the conditional blocks */}
        <div>
          {walletAddress === campaignInfo.admin && (
            <>
              {console.log("walletAddress is equal to passedData.admin")}
              <div>
                {walletAddress} is equal to {campaignInfo.admin}
              </div>
            </>
          )}

          {walletAddress !== campaignInfo.admin && (
            <>
              {/* {console.log("walletAddress is not equal to passedData.admin")} */}
              <div>
                {/* {walletAddress} noooo {campaignInfo.admin} */}
              </div>
            </>
          )}
        </div>
        <div className="">
          {renderAmountInput()}
          <div className="buttons-wrapper">
            <>
              {walletAddress === campaignInfo.admin && renderWithdrawButton()}
              {walletAddress !== campaignInfo.admin && renderDonateButton()}
            </>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SimplePage;
