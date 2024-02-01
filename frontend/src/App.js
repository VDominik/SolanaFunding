import "./App.css";
import idl from "./idl.json";
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

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with pub key: ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
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
    ).then((campaigns) => {
      console.log("Campaigns:", campaigns); // Log campaigns to console
      setCampaigns(campaigns);
    });
  };

  const renderNotConnectedContainer = () => (
    <button className="button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );
  let allDonations = 0;
  const renderConnectedContainer = () => {
    return (
      <>
        {/* <button onClick={createCampaign}>Create a campaign</button> */}
        {/* <button onClick={getCampaigns}>Get a list of campaigns</button> */}
        <br />
        <div className="browse-header">
          <h1 className="cards-header">Browse all campaigns</h1>
          <h2>Browse trough all of the campaigns created on Solario</h2>
        </div>
        <div className="card-wrapper">
          {campaigns.map((campaign) => {
            const progress =
              (campaign.amountDonated /
                web3.LAMPORTS_PER_SOL /
                campaign.amountWanted) *
              100;
            // const dataToPass = {
            //   name: campaign.name,
            //   description: campaign.description,
            //   admin: campaign.admin.toString(),
            //   pubkey: campaign.pubkey.toString(),
            // };
            allDonations += campaign.amountDonated / web3.LAMPORTS_PER_SOL;
            // console.log(allDonations);
            return (
              <Link to={`/campaigns/${campaign.pubkey}`}>
                <div key={campaign.pubkey} className="campaign-card">
                  <div className="card-image">
                    <img
                      src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaign.pubkey}`}
                      alt=""
                    />
                  </div>
                  <div>
                    <h2>{campaign.name}</h2>
                  </div>
                  <progress
                    className="progressbar"
                    value={progress}
                    max="100"
                  ></progress>
                  <p className="card-description">
                    <b> Raised: </b> <br />
                    {(
                      campaign.amountDonated / web3.LAMPORTS_PER_SOL
                    ).toString()}{" "}
                    / {campaign.amountWanted}
                  </p>

                  <p>
                    <b>Creator: </b> {campaign.admin.toString()}
                  </p>
                  <br />
                </div>
              </Link>
            );
          })}
        </div>
      </>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        await onLoad();
        await getCampaigns();
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("load", onLoad);
    fetchData();
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value.toLowerCase());
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    // Customize the conditions based on your search requirements
    return (
      campaign.name.toLowerCase().includes(searchTerm) ||
      campaign.description.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="App">
      <div className="searchbar-wrapper">
        <div className="searchbar-input-wrapper">
          <input
            className="searchbar-input"
            type="text"
            placeholder="Search campaigns"
            onChange={handleSearch}
          />
          🔍
        </div>
      </div>

      {searchTerm ? (
        // Render search results
        <div className="card-wrapper">
          {filteredCampaigns.map((campaign) => (
            <Link to={`/campaigns/${campaign.pubkey}`} key={campaign.pubkey}>
              <div className="campaign-card">
                <div className="card-image">
                  <img
                    src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaign.pubkey}`}
                    alt=""
                  />
                </div>
                <div>
                  <h2>{campaign.name}</h2>
                </div>
                <p className="card-description">{campaign.description}</p>
                <p>
                  <b>Creator: </b>
                  {campaign.admin.toString()}
                  {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()}
                </p>
                <br />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Render all campaigns
        <>
          {!walletAddress && renderNotConnectedContainer()}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>{walletAddress && renderConnectedContainer()}</>
          )}
        </>
      )}
    </div>
  );
};

export default App;
