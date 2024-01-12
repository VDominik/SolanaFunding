// SimplePage.js
import React from "react";
import idl from "./../idl.json";
import "./campaignpage.css";
import { useLocation } from "react-router-dom";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const { SystemProgram } = web3;

const SimplePage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [amount, setamount] = useState(0.1); // Default donation amount

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

      await program.rpc.donate(new BN(amount * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log(`Donated ${amount} SOL to: `, publicKey.toString());
      getCampaigns();
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
      getCampaigns();
    } catch (error) {
      console.log("Error with withdrawal:", error);
    }
  };

  const renderDonateButton = () => {
    return (
      <button className="donate" onClick={() => donate(passedData.pubkey)}>
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
      <button className="withdraw" onClick={() => withdraw(passedData.pubkey)}>
        Click to WITHDRAW!
      </button>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    getCampaigns();
    checkIfWalletConnected();
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="campaign-image-wrapper">
        <div className="campaign-image">
          <div className="image-upload"></div>
        </div>
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

        {/* Fixing the syntax issue and wrapping the conditional blocks */}
        <div>
          {walletAddress === passedData.admin && (
            <>
              {console.log("walletAddress is equal to passedData.admin")}
              <div>
                {walletAddress} is equal to {passedData.admin}
              </div>
            </>
          )}

          {walletAddress !== passedData.admin && (
            <>
              {console.log("walletAddress is not equal to passedData.admin")}
              <div>
                {walletAddress} noooo {passedData.admin}
              </div>
            </>
          )}
        </div>
        <div className="">
          {renderAmountInput()}
          <div className="buttons-wrapper">
            <>
              {walletAddress === passedData.admin && renderWithdrawButton()}
              {walletAddress !== passedData.admin && renderDonateButton()}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;
