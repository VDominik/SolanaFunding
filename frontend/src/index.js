import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./Home/home.js";
import Create from "./Create/Create.js";
import Navbar from "./Navbar/Navbar.js";
import CampaignPage from './CampaignPage/campaignpage.js';
import Footer from "./Footer/footer.js";
import reportWebVitals from "./reportWebVitals";
import About from "./About/about.js";
import Profile from "./Profile/profile.js"
import Feedback from "./Feedback/feedback.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />} />
      <Route path="/create" element={<Create />} />
      <Route path="/campaigns/:campaignId" element={<CampaignPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
