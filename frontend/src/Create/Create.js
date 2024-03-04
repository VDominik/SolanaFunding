import "./Create.css";
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
import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";
import Editor from "../richTextEditor/RichTextEditor";
import { useNavigate } from "react-router-dom";

window.Buffer = Buffer;

const supabase = createClient(
  "https://tjolslegyojdnkpvtodo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2xzbGVneW9qZG5rcHZ0b2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTQ1OTQsImV4cCI6MjAyMDQ3MDU5NH0.yYfp8jRC-X7W6kn3oSEFHNMys57GwnlAwo_z9fs9rO8"
);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const { SystemProgram } = web3;

const Create = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [amountWanted, setAmountWanted] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [counter, setCounter] = useState(0);
  const [selectedButton, setSelectedButton] = useState(null);

  let navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleCampaignNameChange = (event) => {
    setCampaignName(event.target.value);
  };

  const handleAmountWantedChange = (event) => {
    setAmountWanted(event.target.value);
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

  const uploadImageToSupabase = async (filename) => {
    try {
      if (imageFile) {
        console.log("Uploading image with file name:", filename);

        const { data, error } = await supabase.storage
          .from("imagesForCampaigns") // Replace with your actual storage bucket name
          .upload(`images/${filename}`, imageFile);

        if (error) {
          console.error("Error uploading image to Supabase:", error);
        } else {
          console.log("Image uploaded successfully:", data.fullPath);
          return data.fullPath;
          // Assuming passedData is available in the component state
          // updateCampaignWithImage(passedData.pubkey, data.Key);
        }

        // Reset the image file state after uploading
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
    }
  };

  const fetchDataFromDatabase = async () => {
    try {
      const { data, error } = await supabase.from("addressImages").select("id");

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        // Check if data is not empty and has at least one item
        if (data && data.length > 0) {
          let lastCampaignId = data[data.length - 1].id;
          lastCampaignId++;
          // Set the counter to the ID of the last created campaign
          setCounter(lastCampaignId);
          return lastCampaignId; // You can return the ID if needed
        } else {
          console.log("No data found");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const createCampaign = async () => {
    const counterBuffer = Buffer.alloc(4);
    counterBuffer.writeUint32LE(counter);
    console.log(counter);
    const timeNumber = new BN(selectedButton);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const [campaign] = web3.PublicKey.findProgramAddressSync(
        [provider.wallet.publicKey.toBuffer(), counterBuffer],
        program.programId
      );

      // TODO: Do it somehow without the description. For now its okay
      await program.methods
        .create(
          utils.bytes.utf8.encode(campaignName),
          utils.bytes.utf8.encode(""),
          utils.bytes.utf8.encode(amountWanted),
          counter,
          timeNumber
        )
        .accounts({
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const customName = campaign.toString();
      const imageUrl = await uploadImageToSupabase(customName);
      await storeCampaignInDatabase(
        campaign.toString(),
        imageUrl,
        campaignDescription
      );
      console.log("Image URL:", imageUrl);
      console.log("Created a new campaign with address: ", campaign.toString());

      navigate(`/campaigns/${campaign.toString()}?showPopup=true`);
    } catch (error) {
      console.error("Eror creating campaign", error);
    }
  };

  const storeCampaignInDatabase = async (
    campaignAddress,
    imageUrl,
    description
  ) => {
    try {
      // Use Supabase client to store campaign information in your database
      const { data, error } = await supabase
        .from("addressImages") // Replace with your database table name
        .insert([
          {
            programAddress: campaignAddress,
            imageURL:
              "https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public/" +
              imageUrl,
            description: description,
            // Other campaign data fields...
          },
        ]);

      if (error) {
        console.error("Error storing campaign in database", error);
      } else {
        console.log("Campaign stored in the database:", data);
      }
    } catch (error) {
      console.error("Error storing campaign in database", error);
    }
  };

  const handleContentChange = (content) => {
    setCampaignDescription(content);
    console.log(campaignDescription);
  };

  function handleClick(value) {
    setSelectedButton(value);
    console.log(value);

    // Do something with the value
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    fetchDataFromDatabase();
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <div className="create-page-wrapper">
        <div className="create-content-wrapper">
          <div className="create-info-wrapper">
            <div className="infos-wrapper">
              <div className="data-passed-wrapper">
                <div className="data-passed">
                  <div className="heading2">
                    <h2>Create Your Campaign</h2>
                  </div>
                  <input
                    className="create-input"
                    type="text"
                    name="campaignName"
                    placeholder="Enter Campaign Name"
                    value={campaignName}
                    onChange={handleCampaignNameChange}
                  />

                  <h2 className="heading2">
                    Add an image to represent your <br />
                    campaign
                  </h2>

                  <div className="create-image-upload">
                    <div className="campaign-image-wrapper">
                      <div className="create-campaign-image">
                        <div className="image-upload">
                          {!imagePreview && (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          )}
                          {imagePreview && (
                            <img
                              className="image-preview"
                              src={imagePreview}
                              alt="Preview"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Editor
                    className="rteditor"
                    onContentChange={handleContentChange}
                  />

                  <div className="goal-wrapper">
                    <p className="create-paragraph">Set a funding goal:</p>

                  </div>
                  <input
                      className="create-input"
                      type="text"
                      name="amountWanted"
                      placeholder="500 SOL"
                      value={amountWanted}
                      onChange={handleAmountWantedChange}
                    />

                  {/* Pick the length of a campaign */}
                  <div className="create-campaign-length">
                  <p className="create-paragraph">Set the length of campaign:</p>
                  </div>

                  <div className="create-select">
                    
                    <button
                      value="7"
                      onClick={() => handleClick(7)}
                      className={selectedButton === 7 ? "selected" : ""}
                    >
                      7 days
                    </button>
                    <button
                      value="14"
                      onClick={() => handleClick(14)}
                      className={selectedButton === 14 ? "selected" : ""}
                    >
                      14 days
                    </button>
                    <button
                      value="30"
                      onClick={() => handleClick(30)}
                      className={selectedButton === 30 ? "selected" : ""}
                    >
                      30 days
                    </button>
                    <button
                      value="60"
                      onClick={() => handleClick(60)}
                      className={selectedButton === 60 ? "selected" : ""}
                    >
                      60 days
                    </button>
                  </div>
                </div>
              </div>
              <div className="createButtonWrapper">
                <button className="create-button" onClick={createCampaign}>
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
