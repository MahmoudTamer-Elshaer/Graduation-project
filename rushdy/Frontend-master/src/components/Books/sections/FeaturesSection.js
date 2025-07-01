import React from 'react';
// --- استورد CSS هنا ---
import './featureSection.css';

// --- استيراد الأيقونات ---
// !! استبدل هذه بمسارات أيقوناتك الفعلية !!
import iconTranslate from '../components/assetes/text.png';
import iconSave from '../components/assetes/A.png';
import iconWriting from '../components/assetes/elements.jpg';
import iconOcr from '../components/assetes/camera.png';
import iconAi from '../components/assetes/Frame 60.png';
import iconPlatform from '../components/assetes/profile-2user.png';

// --- المكون الفرعي: بطاقة الميزة ---
// (في المشروع الفعلي، هذا يكون في ملف FeatureItem.js)
function FeatureItem({ icon, title, description }) {
  return (
    <div className="feature-item">
      <div className="feature-item-header">
        <img src={icon} alt="" className="feature-icon" />
      </div>
      <div className='test'>
          <h3>{title}</h3>
          <p>{description}</p>
      </div>
    </div>
  );
}


// --- المكون الرئيسي: قسم الميزات ---
function FeaturesSection() {
  // بيانات الميزات (استخدم أيقوناتك الفعلية المستوردة)
  const featuresData = [
    { icon: iconTranslate, title: 'Instant Translation While Reading', description: 'Translate words and sentences while reading without leaving the page, making the learning experience smoother.' },
    { icon: iconSave, title: 'Save Vocabulary & Enhance Learning', description: 'Easily save new words and review them later with interactive exercises to reinforce memory.' },
    { icon: iconWriting, title: 'Writing Enhancement & Proofreading', description: 'Analyze your written texts and receive suggestions for improved phrasing and grammar correction.' },
    { icon: iconOcr, title: 'OCR Support for Image Translation', description: 'Upload or capture an image, and Lexi Read will extract and translate the text with precision.' },
    { icon: iconAi, title: 'AI-Powered Text Understanding', description: 'Use AI to summarize articles or explain complex sentences, helping you grasp content more effectively.' },
    { icon: iconPlatform, title: 'Seamless Multi-Platform Experience', description: 'Available on web and mobile apps, allowing you to enjoy all features anytime, anywhere.' },
  ];

  return (
    <section className="features-section section-container">
      <h2 className="section-title">Why Choose Lexi Read?</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
