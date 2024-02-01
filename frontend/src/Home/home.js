import "./home.css";
import idl from "./../idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const { Link } = require("react-router-dom"); // Import Link from react-router-dom

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const { SystemProgram } = web3;

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);



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
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        const response = await solana.connect();
        console.log("Connected with pub key: ", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const getCampaigns = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const allCampaigns = await connection.getProgramAccounts(programID);
    const limitedCampaigns = allCampaigns.slice(0, 5); // Only take the first 5 campaigns
    Promise.all(
      limitedCampaigns.map(async (campaign) => ({
        ...(await program.account.campaign.fetch(campaign.pubkey)),
        pubkey: campaign.pubkey,
      }))
    ).then((campaigns) => {
      setCampaigns(campaigns);
    });
  };

  const renderNotConnectedContainer = () => (
    <button className="connectButton" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const redirectToApp = () => window.location.replace("/app");

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
      await getCampaigns();
      if(campaigns){
        setLoading(false);
      }
    };
    onLoad();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <div className="pageWrapper">
        <div className="hero-section">
          <div className="image">
            {walletAddress ? (
              <button className="connectButton" onClick={redirectToApp}>
                Continue to App
              </button>
            ) : (
              renderNotConnectedContainer()
            )}
          </div>
        </div>

        <div className="recommended">
          <h1>Recommended for you</h1>
        </div>
        <div className="recommended-wrapper">
          <div className="recommended-cards-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
            {campaigns.slice(0, 5).map((campaign, index) => (
              <div
                key={index}
                className={`recommended-card-${
                  index === 0 ? "main" : "secondary"
                }-wrapper`}
              >
                <Link to={`/campaigns/${campaign.pubkey}`}>
                  <div
                    className={`recommended-card-${
                      index === 0 ? "main" : "secondary"
                    }`}
                  >
                    <div
                      className={`recommended-card-${
                        index === 0 ? "main" : "secondary"
                      }-image`}
                    >
                      <img
                        src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaign.pubkey}`}
                        alt=""
                      />
                    </div>
                    <div
                      className={`recommended-card-${
                        index === 0 ? "main" : "secondary"
                      }-name`}
                    >
                      {campaign.name}
                    </div>
                  </div>
                </Link>
              </div>
            ))}

</>
          )}
          </div>
          <button className="show-all-button" onClick={redirectToApp}>
            Show all Campaigns
          </button>
        </div>

        <div className="cards-wrapper">
          <div className="card">
            <h1>Total</h1>
            <h2>Money Donated:</h2>
            <div className="card-number">$709,321</div>
          </div>
          <div className="card">
            <h1>Today</h1>
            <h2>Today Money Donated:</h2>
            <div className="card-number">$32,980</div>
          </div>
          <div className="card">
            <h1>Total</h1>
            <h2>Project Funded:</h2>
            <div className="card-number">521</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
