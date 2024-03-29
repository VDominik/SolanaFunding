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
import Recommended from "../Recommended/recommended";

import donateIcon from "./solidarity3.png";
import fbIcon from "./facebook.png";
import twitterIcon from "./twitter.png";
import linkIcon from "./link.png";

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
  const [amount, setamount] = useState(0.1); // Default donation amount
  const params = useParams();
  const campaignId = params.campaignId;
  const [campaignInfo, setCampaignInfo] = useState({
    admin: null,
    campaignName: null,
    campaignDescription: null,
    amountDonated: null,
    amountWanted: null,
    list_of_donors: null,
    donation_amount: null,
  });
  const [loading, setLoading] = useState(true);
  const [campaignDescription, setCampaignDescription] = useState("");
  const [isConfirmPopupVisible, setConfirmPopupVisibility] = useState(false);
  const [isErrorPopupVisible, setErrorPopupVisibility] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const campaignUrl = window.location.href; // Get the current URL

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopySuccess("Copied!");
  };

  let progress = 0;
  progress = (campaignInfo.amountDonated / campaignInfo.amountWanted) * 100;

  const handleAmountChange = (event) => {
    const inputValue = event.target.value;

    // Replace commas with dots
    const formattedValue = inputValue.replace(/,/g, ".");

    // Update the state with the formatted value
    setamount(formattedValue);
  };

  const location = useLocation();

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

  let getAvailableBalance = async () => {
    const provider = getProvider();
    const balance = await provider.connection.getBalance(new PublicKey(campaignId));
    const balanceInSol = balance / web3.LAMPORTS_PER_SOL;

  // Set a buffer amount
  const bufferInSol = 0.07; // Set this to the value you want to keep as a buffer

  // Subtract the buffer from the total balance
  const availableBalance = balanceInSol - bufferInSol;

  console.log(`The balance of ${campaignId} is ${availableBalance} SOL`);
  return availableBalance;
  };

  const getCampaignById = async (campaignId) => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const campaignAccount = await program.account.campaign.fetch(
      new PublicKey(campaignId)
    );
    const admin = campaignAccount.admin.toString();
    const campaignName = campaignAccount.name;
    const amoutDonated = (
      campaignAccount.amountDonated / web3.LAMPORTS_PER_SOL
    ).toFixed(2);
    const amountWanted = campaignAccount.amountWanted;
    const list_of_donors_full = campaignAccount.listOfDonors.toString();
    const list_of_donors = list_of_donors_full.split(",");
    const donation_amount = campaignAccount.donationAmount;
    console.log("list_of_donors:", campaignAccount.donationAmount.toString());

    // const campaignDescription = campaignAccount.description;

    // console.log("Admin inside getCampaignById:", admin);

    return {
      admin,
      campaignName,
      campaignDescription,
      amoutDonated,
      amountWanted,
      list_of_donors,
      donation_amount,
    };
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log(
        "pub: ",
        publicKey,
        "prov:",
        provider.wallet.publicKey,
        "sys: ",
        SystemProgram.programId
      );

      await program.rpc.donate(new BN(amount * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          developer: new PublicKey(
            "AZh3i2QBZkpe8HdgoW3uWabwWAZqeVgfpkEVD9ja7GN"
          ),
        },
      });
      console.log(`Donated ${amount} SOL to: `, publicKey.toString());
      getCampaignById(campaignId);
      setConfirmPopupVisibility(true);
    } catch (error) {
      console.log("Error donating: ", error.message);
      setErrorPopupVisibility(true);
    }
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
      setConfirmPopupVisibility(true);
    } catch (error) {
      setErrorPopupVisibility(true);
    }
  };

  const renderDonateButton = () => {
    return (
      <>
        <div className="whole-input-wrapper">
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
            <div className="input-text">SOL</div>
          </div>
        </div>

        <div className="buttons-wrapper">
          <button className="donate" onClick={() => donate(campaignId)}>
            Donate
          </button>
        </div>
      </>
    );
  };

  const handleMaxClick = async () => {
    let availableBalance = await getAvailableBalance();
    console.log("Available balance: ", availableBalance);
    setamount(availableBalance);
  };

  const renderWithdrawButton = () => {
    // Add this function to your component

    return (
      <>
        <div className="whole-input-wrapper">
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
            {{ handleMaxClick } && (
              <button className="max-amount-button" onClick={handleMaxClick}>
                MAX
              </button>
            )}
          </div>
        </div>
        <div className="buttons-wrapper">
          <button className="withdraw" onClick={() => withdraw(campaignId)}>
            Withdraw
          </button>
        </div>
      </>
    );
  };

  const fetchDataFromDatabase = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const onLoad = async () => {
      await checkIfWalletConnected();
      if (campaignId) {
        const {
          admin,
          campaignName,
          amoutDonated,
          amountWanted,
          list_of_donors,
          donation_amount,
        } = await getCampaignById(campaignId);
        console.log("Admin inside useEffect:", list_of_donors.toString());
        // console.log("Admin inside useEffect:", admin);
        setLoading(false);
        fetchDataFromDatabase();
        setCampaignInfo({
          admin,
          campaignName,
          amountDonated: amoutDonated,
          amountWanted,
          list_of_donors,
          donation_amount,
        });
        getAvailableBalance();
        // Now you can use admin, campaignName, campaignDescription as needed
      }
    };

    const showPopupParam = new URLSearchParams(location.search).get(
      "showPopup"
    );

    // Check if the showPopup parameter is present and has a truthy value
    if (showPopupParam && showPopupParam.toLowerCase() === "true") {
      setConfirmPopupVisibility(true);
    }

    onLoad();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [campaignId]);

  const handleCloseConfirmPopup = () => {
    // Close the pop-up
    setConfirmPopupVisibility(false);
  };

  const handleCloseErrorPopup = () => {
    // Close the pop-up
    setErrorPopupVisibility(false);
  };

  const tweetText = `Check out this campaign: ${campaignInfo.campaignName} ${window.location.href}`;

  return (
    <>
      {isConfirmPopupVisible && (
        <Popup
          message="Transaction Confirmed!"
          onClose={handleCloseConfirmPopup}
        />
      )}
      {isErrorPopupVisible && (
        <Popup message="Transaction Failed!" onClose={handleCloseErrorPopup} />
      )}

      <div className="campaign-page-wrapper">
        <div className="campaign-content-wrapper">
          {/* <div className="breadcrumbs">
            <Link to={`/App`}>
              <span>&lt;&lt; Back</span>
            </Link>
          </div> */}

          <div className="whole-wrapper">
            <div className="campaign-info">
              <div className="campaign-image-wrapper">
                <div className="campaign-image">
                  <img
                    src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaignId}`}
                    alt=""
                  />
                </div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {campaignInfo.admin && (
                      <>
                        <h2 className="campaign-info-name">
                          {campaignInfo.campaignName}
                        </h2>
                      </>
                    )}
                  </>
                )}
                <div className="campaign-creator-wrapper">
                  <p className="campaign-info-bold">Creator:</p>
                  <p className="campaign-info-non-bold">{campaignInfo.admin}</p>
                  <p className="campaign-info-bold">Campaign Public key:</p>
                  <p className="campaign-info-non-bold">{campaignId}</p>
                </div>
                <div>
                  <div className="info-wrapper">
                    <div className="data-passed-wrapper">
                      <div className="data-passed">
                        {loading ? (
                          <p style={{ minWidth: "800px" }}>Loading...</p>
                        ) : (
                          <>
                            {campaignInfo.admin && (
                              <>
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
                  </div>
                </div>
              </div>
            </div>
            <div className="campaign-page-info">
              <div className="campaign-page-info-hideable">
                <p className="campaign-info-non-bold">
                  <b>Raised:</b> {campaignInfo.amountDonated} /
                  {campaignInfo.amountWanted} SOL
                </p>
                <progress className="progressbar" value={progress} max="100" />

                <div className="donate-info-web">
                  <>
                    {walletAddress === campaignInfo.admin &&
                      renderWithdrawButton()}
                    {walletAddress !== campaignInfo.admin &&
                      renderDonateButton()}
                  </>
                </div>
                <div className="share-block">
                  <div className="share-block-button">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        tweetText
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={twitterIcon}
                        alt="link icon"
                        className="link-icon"
                      />
                      <p>Twitter</p>
                    </a>
                  </div>
                  <div className="share-block-button">
                    <img
                      src={linkIcon}
                      alt="link icon"
                      className="link-icon"
                      onClick={copyToClipboard}
                    />
                    <p>Copy Link</p>
                    {copySuccess && (
                      <div style={{ color: "green" }}>{copySuccess}</div>
                    )}
                  </div>
                  <div className="share-block-button">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        campaignUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={fbIcon} alt="link icon" className="link-icon" />
                      <p>Facebook</p>
                    </a>
                  </div>
                </div>
                <p className="campaign-total-donations">
                  {campaignInfo.list_of_donors
                    ? campaignInfo.list_of_donors.length
                    : 0}{" "}
                  Donations in total
                </p>
                {/* <p className="campaign-last-donors">Last Donations:</p> */}
                {campaignInfo.list_of_donors
                  ? campaignInfo.list_of_donors
                      .slice(-5)
                      .reverse()
                      .map((donor, index, donorsSlice) => (
                        <div className="campaign-last-donors-list" key={index}>
                          <img
                            src={donateIcon}
                            alt="donate icon"
                            className="donate-icon"
                          />
                          <div>
                            <p className="donor-address">
                              {donor.toString().slice(0, 3)}...
                              {donor.toString().slice(-5)}
                            </p>
                            <p className="donor-name">
                              {campaignInfo.donation_amount[
                                campaignInfo.donation_amount.length -
                                  donorsSlice.length +
                                  index
                              ] / web3.LAMPORTS_PER_SOL}{" "}
                              SOL
                            </p>
                          </div>
                        </div>
                      ))
                  : null}
              </div>
            </div>
            <div className="donate-info-phone">
              <>
                {walletAddress === campaignInfo.admin && renderWithdrawButton()}
                {walletAddress !== campaignInfo.admin && renderDonateButton()}
              </>
            </div>
          </div>
        </div>
        <Recommended />
      </div>
    </>
  );
};

export default SimplePage;
