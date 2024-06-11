import React, { useState } from 'react';
import "./waitlist.css";
import { createClient } from "@supabase/supabase-js";
import ArrowRight from "./right-arrow.png";
import CampaignList from '../CampaignList/campaignlist';

const supabase = createClient(
    "https://tjolslegyojdnkpvtodo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2xzbGVneW9qZG5rcHZ0b2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTQ1OTQsImV4cCI6MjAyMDQ3MDU5NH0.yYfp8jRC-X7W6kn3oSEFHNMys57GwnlAwo_z9fs9rO8"
  );

const Waitlist = () => {

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await storeCampaignInDatabase();
  };

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

  return (
    <div className='waitlist-wrapper'>
      <h1 className='waitlist-h1'>Get early access</h1>
      <h3 className='waitlist-h3'>Join our whitelist to access the platform ahead of everyone else <br /> and unlock exclusive offers</h3>
      <div className='waitlist-text'>
        <h1>Join the waitlist now</h1>
        <div className='waitlist-formwrapper'>
      <form className='waitlist-form' onSubmit={handleSubmit}>
        <input 
        className='waitlist-input'
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleInputChange}
          required
        />
        <button className='waitlist-button' type="submit"><img className='arrow-right-img' src={ArrowRight} alt=""></img></button>

      </form>
      </div>
      </div>
    <CampaignList />

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
  );
};

export default Waitlist;
