// SimplePage.js
import React from 'react';
import './campaignpage.css'
import { useLocation } from 'react-router-dom';

const SimplePage = () => {
  const location = useLocation();
  const passedData = location.state;

  return (
    <div>
    <div className='page-wrapper'>
      <div className='campaign-image'>
        Hello
      </div>
      <div className='data-passed'>
        {passedData ? (
                    <>
      <h1>{passedData.pubkey}</h1>
      

          <p>Name: {passedData.name}</p>
          <p>Description: {passedData.description}</p>
          <p>Public key: {passedData.pubkey}</p>
        </>
      ) : (
        <p>No data passed.</p>
      )}
      </div>
    </div>
    </div>
  );

  
};

export default SimplePage;
