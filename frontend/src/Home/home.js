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
import cheapIcon from "./piggy-bank.png";
import fastIcon from "./rocket.png";
import easyIcon from "./wallet.png";
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
  let progress = 0;

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
    const limitedCampaigns = allCampaigns.slice(0, 4); // Only take the first 5 campaigns
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
      if (campaigns) {
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
            <h2 className="hero-heading">Funding Dreams, Uniting Solana</h2>
            {walletAddress ? (
              <button className="connectButton" onClick={redirectToApp}>
                Continue to App
              </button>
            ) : (
              renderNotConnectedContainer()
            )}
          </div>
        </div>

        <div className="wrapper">
          <div className="recommended">
            {/* <h1>Recommended for you</h1> */}
            <h2>Discover Campaigns</h2>
          </div>
          <div className="recommended-wrapper">
            <div className="recommended-cards-wrapper">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {campaigns.slice(0, 4).map(
                    (campaign, index) => (
                      (progress =
                        (campaign.amountDonated /
                          web3.LAMPORTS_PER_SOL /
                          campaign.amountWanted) *
                        100),
                      (
                        <div
                          key={index}
                          className="recommended-card-secondary-wrapper"
                        >
                          <Link to={`/campaigns/${campaign.pubkey}`}>
                            <div className="recommended-card-secondary">
                              <div className="recommended-card-secondary-image">
                                <img
                                  src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaign.pubkey}`}
                                  alt=""
                                />
                              </div>
                              <div className="recommended-card-secondary-name">
                                <progress
                                  className="progressbar"
                                  value={progress}
                                  max="100"
                                ></progress>
                                {campaign.name}
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    )
                  )}
                </>
              )}
            </div>
          </div>
          <button className="show-all-button" onClick={redirectToApp}>
            Show all Campaigns
          </button>

          <div className="why-us">
            <div>
              <h1>Why Choose Us?</h1>
            </div>

            {/* <p>
            We are a decentralized crowdfunding platform that allows you to
            create and fund campaigns using the Solana blockchain. We provide
            transparency and security to all our users. Our platform is
            completely free to use and we do not charge any fees for creating
            campaigns. We are a community-driven platform and we believe in
            helping others. Our platform is built on the Solana blockchain which
            means that all transactions are fast and cheap. We are also
            integrated with Phantom wallet which makes it easy for users to
            create and fund campaigns.
          </p> */}
            <div className="why-icons-wrapper">
              <div className="why-icon-wrapper">
                <img src={easyIcon} alt=""></img>
                <div className="why-icon-easy">
                  <h2>EASY</h2>
                </div>
                <p>
                  Connect your wallet and start raising funds without hassle
                </p>
              </div>
              <div className="why-icon-wrapper">
                <img src={cheapIcon} alt=""></img>
                <div className="why-icon-cheap">
                  <h2>CHEAP</h2>
                </div>
                <p> 0% withdrawal fees means more money goes to your goal</p>
              </div>
              <div className="why-icon-wrapper">
                <img src={fastIcon} alt=""></img>
                <div className="why-icon-fast">
                  <h2>FAST</h2>
                </div>
                <p>
                  We utilize Solana's robust smart contracts for speefy
                  transactions
                </p>
              </div>
            </div>
          </div>

          <div className="cards-wrapper">
            <div className="card">
              <h2>Total Money Donated:</h2>
              <div className="card-number">$709,321</div>
            </div>
            <div className="card">
              <h2>Today Money Donated:</h2>
              <div className="card-number">$32,980</div>
            </div>
            <div className="card">
              <h2>Total Project Funded:</h2>
              <div className="card-number">521</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
