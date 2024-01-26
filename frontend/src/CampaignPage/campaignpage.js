// SimplePage.js
import React from "react";
import idl from "./../idl.json";
import "./campaignpage.css";
import { useLocation } from "react-router-dom";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Popup from "../Popup/popup";

const { Link } = require("react-router-dom"); // Import Link from react-router-dom

const supabase = createClient(
  "https://tjolslegyojdnkpvtodo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2xzbGVneW9qZG5rcHZ0b2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTQ1OTQsImV4cCI6MjAyMDQ3MDU5NH0.yYfp8jRC-X7W6kn3oSEFHNMys57GwnlAwo_z9fs9rO8"
);
const tableName = "addressImages";

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
  const [previewMode, setPreviewMode] = useState(false);
  const [campaignDescription, setCampaignDescription] = useState("");
  const [isPopupVisible, setPopupVisibility] = useState(false);

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

  let getAvailableBalance = async() => {
    const provider = getProvider();
    const balance = await provider.connection.getBalance(new PublicKey(campaignId));
    const balanceInSol = balance / web3.LAMPORTS_PER_SOL;
    const availableBalance = Math.floor(balanceInSol * 10) / 10; // Rounds down to the nearest 0.1 SOL
    console.log(`The balance of ${campaignId} is ${availableBalance} SOL`);
    return availableBalance;
  }

  const getCampaignById = async (campaignId) => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const campaignAccount = await program.account.campaign.fetch(
      new PublicKey(campaignId)
    );
    const admin = campaignAccount.admin.toString();
    const campaignName = campaignAccount.name;

    // const campaignDescription = campaignAccount.description;

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
    setPopupVisibility(true);
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
    setPopupVisibility(true);
  };

  const renderDonateButton = () => {
    return (
      <>
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
    <div className="buttons-wrapper">
      <button className="donate" onClick={() => donate(campaignId)}>
        Click to DONATE!
      </button>
      </div>
      </>
    );
  };


  const handleMaxClick = async () => {
    let availableBalance = await getAvailableBalance();
    setamount(availableBalance);
  };

  const renderWithdrawButton =() => {
// Add this function to your component

    return (
      <>
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
      {{handleMaxClick} && <button onClick={handleMaxClick}>MAX</button>}
    </div>
    <div className="buttons-wrapper">
      <button className="withdraw" onClick={() => withdraw(campaignId)}>
        Click to WITHDRAW!
      </button>
    </div>
      </>
    );
  };

  const fetchDataFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("description")
        .eq("programAddress", campaignId);

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        // Check if data is not empty and has at least one item
        if (data && data.length > 0) {
          const campaignDescription = data[0].description;
          setCampaignDescription(campaignDescription);
          console.log(campaignDescription);
          return campaignDescription; // You can return the description text if needed
        } else {
          console.log("No data found");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
      if (campaignId) {
        const { admin, campaignName } = await getCampaignById(campaignId);
        // console.log("Admin inside useEffect:", admin);
        setLoading(false);
        fetchDataFromDatabase();
        setCampaignInfo({ admin, campaignName });
        // Now you can use admin, campaignName, campaignDescription as needed
      }
    };
    const showPopupParam = new URLSearchParams(location.search).get(
      "showPopup"
    );

    // Check if the showPopup parameter is present and has a truthy value
    if (showPopupParam && showPopupParam.toLowerCase() === "true") {
      setPopupVisibility(true);
    }

    onLoad();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [campaignId, location.search]);

  const handleClosePopup = () => {
    // Close the pop-up
    setPopupVisibility(false);
  };

  return (
    <>
      {isPopupVisible && (
        <Popup message="Transaction Confirmed!" onClose={handleClosePopup} />
      )}
      <div className="breadcrumbs">
        <Link to={`/App`}>
          <span>&lt;&lt; Back</span>
        </Link>
      </div>
      <div className="page-wrapper">
        <div className="campaign-image-wrapper">
          <div className="campaign-image">
            <img
              src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaignId}`}
              alt=""
            />
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
                      <div
                        dangerouslySetInnerHTML={{
                          __html: campaignDescription,
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {walletAddress === campaignInfo.admin && (
              <>
                {console.log("walletAddress is equal to passedData.admin")}
                <div>
                  {walletAddress} is equal to {campaignInfo.admin}
                </div>
              </>
            )}
          </div>
          <div className="">
              <>
                {walletAddress === campaignInfo.admin && renderWithdrawButton()}
                {walletAddress !== campaignInfo.admin && renderDonateButton()}
              </>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimplePage;
