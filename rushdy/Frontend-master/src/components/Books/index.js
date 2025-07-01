import React from 'react';
import './App.css'; // استيراد ملف CSS الرئيسي
// import HeroSection from './sections/HeroSection';
import HeroSection from "./sections/HeroSection";
import BooksSection from './sections/BooksSection';
import FeaturesSection from './sections/FeaturesSection';
import AppPromoSection from './sections/AppPromoSection';

function Appp() {
  return (
    <div className="App">
      <HeroSection />
      <BooksSection />
      <FeaturesSection />
      <AppPromoSection />
      
    </div>
  );
}

export default Appp;

