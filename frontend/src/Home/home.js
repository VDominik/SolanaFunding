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
        <h2>Recommended for you</h2>
      </div>

      <div className='cards-wrapper'>
      <div className='card'>
          <h1>Total</h1>
          <h2>Money Donated:</h2> 
          <div className='card-number'>
            $0
          </div>
        </div>
        <div className='card'>
          <h1>Today</h1>
          <h2>Today Money Donated:</h2>
          <div className='card-number'>
            $0
          </div>
        </div>
        <div className='card'>
          <h1>Total</h1>
          <h2>Money Withdrawn:</h2>
          <div className='card-number'>
            $0
          </div>
        </div>
      </div>

  </div>
    </>
  );
};

export default Home;
