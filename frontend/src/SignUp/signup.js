import React, { useState, useEffect } from "react";
import "./signup.css";
import idl from "./../idl.json";
import { createClient } from "@supabase/supabase-js";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import cheapIcon from "../Home/piggy-bank.png";
import fastIcon from "../Home/rocket.png";
import easyIcon from "../Home/wallet.png";
import featureimg from "./fundraising.jpg";
import CampaignList from "../CampaignList/campaignlist";
import ArrowRight from "../Waitlist/right-arrow.png";


const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };

const supabase = createClient(
  "https://tjolslegyojdnkpvtodo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2xzbGVneW9qZG5rcHZ0b2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTQ1OTQsImV4cCI6MjAyMDQ3MDU5NH0.yYfp8jRC-X7W6kn3oSEFHNMys57GwnlAwo_z9fs9rO8"
);

const SignUpPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  let progress = 0;
  const [formData, setFormData] = useState({
    email: "",
  });

  const storeCampaignInDatabase = async () => {
    try {
      const { data, error } = await supabase.from("signups").insert([formData]);

      if (error) {
        console.error("Error storing campaign in database", error);
      } else {
        console.log("Campaign stored in the database:", data);
        window.location.assign("/");
      }
    } catch (error) {
      console.error("Error storing campaign in database", error);
    }
  };

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

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await storeCampaignInDatabase();
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
    <div className="signup-pageWrapper">
      <div className="signup-hero-section">
        <div className="signup-image">
          <h2 className="signup-hero-heading">
            Funding Dreams, Uniting Solana
          </h2>
          <h3>Be the First to Know When We Launch!</h3>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              className="signup-input"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              onChange={handleInputChange}
              required
            />
            <input className="signup-submit" type="submit" value="Sign Up" />
          </form>
        </div>
      </div>

      <div className="wrapper">
        <div className="signup-recommended">
          {/* <h1>Recommended for you</h1> */}
          <h2>What is Solario?</h2>
          <div className="feature-section">
            <div className="feature-section-text">
            <p className="feature-recommended-p">
              Solario is a crowdfunding platform built on the Solana blockchain,
              designed to bring the power of community to the forefront of
              fundraising. Whether you're an aspiring entrepreneur, creative
              artist, or passionate changemaker, Solario provides a seamless,
              secure, and efficient space to launch and support projects.
              </p>
              <p className="feature-recommended-p">

              Elevate your fundraising game with our platform.
              <br />
              Enjoy fast, secure transactions and global reach,
              <br />
              ensuring your campaign gets the support it needs.
              <br />
              Harness the power of blockchain for your vision.
            </p>
            <div className="cta-buttons">
              <a href="/about">
                <button className="cta-button-learn"> Learn More</button>
              </a>
              <a href="/about">
                <button className="cta-button-noborder"> Sign Up &nbsp; &gt;</button>
              </a>
      </div>

            </div>
            <div className="feature-section-image-wrapper">
              <img src={featureimg} alt=""></img>
            </div>
          </div>
        </div>
        {/* <div className="recommended-wrapper"></div>
            <button className="show-all-button">Show all Campaigns</button> */}

        <div className="why-us">
          <div>
            <h2>Why Choose Us?</h2>
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
                <h3 className="card-heading">EASY</h3>
              </div>
              <p>Connect your wallet and start raising funds effortlessly</p>
            </div>
            <div className="why-icon-wrapper">
              <img src={cheapIcon} alt=""></img>
              <div className="why-icon-cheap">
                <h3 className="card-heading">AFFORDABLE</h3>
              </div>
              <p>0% withdrawal fees mean more money goes to your goal</p>
            </div>
            <div className="why-icon-wrapper">
              <img src={fastIcon} alt=""></img>
              <div className="why-icon-fast">
                <h3 className="card-heading">FAST</h3>
              </div>
              <p>
                We utilize Solana's robust smart contracts for speedy
                transactions
              </p>
            </div>
          </div>
          <div className="recommended-wrapper">
            <h2>Discover Campaigns</h2>
            <CampaignList />
          </div>
          <div className="cta-section">
            <div className="cta-section-text">
              <h1>
                Empower Your Fundraising Journey <br /> Today
              </h1>
              <p>
                Discover the power of our Solana blockchain fundraising platform
              </p>
            </div>
            <div className="cta-buttons">
              <a href="/about">
                <button className="cta-button-signup"> Sign Up</button>
              </a>
              <a href="/about">
                <button className="cta-button-learn"> Learn More</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
