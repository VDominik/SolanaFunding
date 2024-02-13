import idl from "../idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
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
      setCampaigns(campaigns);
    });
  };

  const renderNotConnectedContainer = () => (
    <button className="button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    return (
      <>
      <div className="App">
        <br />
        <div className="browse-header">
        <p>Connected with wallet: {walletAddress}</p>

          <h1 className="cards-header">Browse Your campaigns</h1>
          <p className="cards-p">Browse trough all of the campaigns you created on Solario</p>
        </div>
        <div className="card-wrapper">
          
          {campaigns.map((campaign) => {
            if (campaign.admin.toString() === walletAddress) {
              const progress =
                (campaign.amountDonated /
                  web3.LAMPORTS_PER_SOL /
                  campaign.amountWanted) *
                100;

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
                      <p className="campaign-name">{campaign.name}</p>
                    </div>
                    <progress
                      className="progressbar"
                      value={progress}
                      max="100"
                    ></progress>
                    <p className="card-description">
                      <b> Raised: </b> <br />{" "}
                      {(
                        campaign.amountDonated / web3.LAMPORTS_PER_SOL
                      ).toString()}{" "}
                      / {campaign.amountWanted}
                    </p>

                    <p className="campaign-creator">
                    Creator: {campaign.admin.toString().slice(0, 3)}...
                    {campaign.admin.toString().slice(-5)}
                    </p>
                    <br />
                  </div>
                </Link>
              );
            }
          })}
        </div>
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

  return (
    <>
      {!walletAddress && renderNotConnectedContainer()}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>{walletAddress && renderConnectedContainer()}</>
      )}

    </>
  );
};

export default App;
