import React, { useState, useEffect } from "react";
import "./campaignlist.css";
import idl from "./../idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3
} from "@project-serum/anchor";

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };


const CampaignList = () => {
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

  useEffect(() => {
    const onLoad = async () => {
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
                <div key={index} className="recommended-card-secondary-wrapper">
                  <div className="recommended-card-secondary">
                    <div className="recommended-card-secondary-image">
                      <img
                        src={`https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public//imagesForCampaigns/images/${campaign.pubkey}`}
                        alt=""
                      />
                    </div>
                    <div className="recommended-card-secondary-name">
                      {campaign.name}
                    </div>
                    <progress
                      className="progressbar"
                      value={progress}
                      max="100"
                    ></progress>
                    <div className="recommended-card-secondary-info">
                      <p>
                        Raised:
                        <br />
                        {campaign.amountDonated / web3.LAMPORTS_PER_SOL} /{" "}
                        {campaign.amountWanted}
                      </p>
                      <p>
                        Creator: {campaign.admin.toString().slice(0, 3)}...
                        {campaign.admin.toString().slice(-5)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </>
      )}
    </div>
              {/* <button className="show-all-button">
              Show all Campaigns
            </button> */}
            </>
  );
};
export default CampaignList;
