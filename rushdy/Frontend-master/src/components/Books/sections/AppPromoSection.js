// AppPromoSection.js
import React from 'react';
import phoneImage from '../components/assetes/iphone.png'; // تأكد من المسار الصحيح
import appstore from '../components/assetes/App Store Badge.png';
import GooglePlay from '../components/assetes/Google Play Badge.png';

function AppPromoSection() {
  return (
    <section className="app-promo-section">
      <div className="container app-promo-content"> 

        <div className="app-promo-image"> 
          <img src={phoneImage} alt="Lexi Read App on phone" />
        </div>

        <div className="app-promo-text"> 
          <h2>Discover it now on the App Store!</h2>
          <p>Unlock a smarter way to read - Download Lexi Read and dive into your language adventure today!</p>
          <div className="app-store-buttons">
            <p>Get the App</p> 
            <button>
              <img src= {GooglePlay}alt="Get it on Google Play" />
            </button>
            <button>
              <img src={appstore} alt="Download on the App Store" />
            </button>
            
          </div>
        </div>

      </div>
    </section>
  );
}

export default AppPromoSection;
