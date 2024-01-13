import './home.css';
import { useEffect, useState } from 'react';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet is installed!");
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log("Connected with pub key: ", response.publicKey.toString());
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

  const renderNotConnectedContainer = () => (
    <button className='connectButton' onClick={connectWallet}>Connect to Wallet</button>
  );
  
  const redirectToApp = () => (
    window.location.replace("/app")
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
  <div className='pageWrapper'>

    <div className='hero-section'>
      <div className='image'>
        {walletAddress ? (
          <button className='connectButton' onClick={redirectToApp}>Go to App</button>
          ) : (
            renderNotConnectedContainer()
          )}
      </div>
    </div>

    <div className='recommended'>
      <h1>Recommended for you</h1>
    </div>

    <div className='recommended-cards-wrapper'>

      <div className='recommended-card-main-wrapper'>
        <div className='recommended-card-main'>
          <div className='recommended-card-main-image'></div>
          <div className='recommended-card-main-name'>
            Main
          </div>
        </div>
      </div>

      <div className='recommended-card-secondary-wrapper'>
        <div className='recommended-card-secondary-wrapper-first-row'>
          <div className='recommended-card-secondary'>
            <div className='recommended-card-secondary-image'></div>
            <div className='recommended-card-secondary-name'>
              Sec
            </div>
          </div>
          <div className='recommended-card-secondary'>
            <div className='recommended-card-secondary-image'></div>
            <div className='recommended-card-secondary-name'>
              Sec
            </div>
          </div>
          </div>
          <div className='recommended-card-secondary-wrapper-second-row'>
          <div className='recommended-card-secondary'>
            <div className='recommended-card-secondary-image'></div>
            <div className='recommended-card-secondary-name'>
              Sec
            </div>
          </div>
          <div className='recommended-card-secondary'>
            <div className='recommended-card-secondary-image'>
            <img src='https://tjolslegyojdnkpvtodo.supabase.co/storage/v1/object/public/imagesForCampaigns/images/test500.jpeg'
                   alt=""
                   />
                   </div>
            <div className='recommended-card-secondary-name'>
              Sec
            </div>
          </div>
        </div>
      </div>
      
    </div>  

    <div className='cards-wrapper'>
      <div className='card'>
        <h1>Total</h1>
        <h2>Money Donated:</h2> 
        <div className='card-number'>
          $709,321
        </div>
      </div>
      <div className='card'>
        <h1>Today</h1>
        <h2>Today Money Donated:</h2>
        <div className='card-number'>
          $32,980
        </div>
      </div>
      <div className='card'>
        <h1>Total</h1>
        <h2>Project Funded:</h2>
        <div className='card-number'>
          521
        </div>
      </div>
    </div>

  </div>
    </>
  );
};

export default Home;
