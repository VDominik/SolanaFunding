import React, { useState } from 'react';
import './feedback.css';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://tjolslegyojdnkpvtodo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2xzbGVneW9qZG5rcHZ0b2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTQ1OTQsImV4cCI6MjAyMDQ3MDU5NH0.yYfp8jRC-X7W6kn3oSEFHNMys57GwnlAwo_z9fs9rO8"
);

const FeedbackPage = () => {
    const [formData, setFormData] = useState({ f_name: '', l_name: '', email: '', message: '' });

    const storeCampaignInDatabase = async () => {
        try {
            const { data, error } = await supabase
                .from("feedback")
                .insert([formData]);

            if (error) {
                console.error("Error storing campaign in database", error);
            } else {
                console.log("Campaign stored in the database:", data);
                window.location.assign("/")

            }
        } catch (error) {
            console.error("Error storing campaign in database", error);
        }
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await storeCampaignInDatabase();
    }

    return (
        <div className='feedback-form'>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input className='feedback-input' type="text" name="f_name" onChange={handleInputChange} />
                </label>
                <label>
                    Last Name:
                    <input className='feedback-input' type="text" name="l_name" onChange={handleInputChange} />
                </label>
                <label>
                    Email:
                    <input className='feedback-input' type="email" name="email" onChange={handleInputChange} />
                </label>
                <label>
                    Message:
                    <textarea className='feedback-message' name="message" onChange={handleInputChange} />
                </label>
                <input className='feedback-submit feedback-input' type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default FeedbackPage;