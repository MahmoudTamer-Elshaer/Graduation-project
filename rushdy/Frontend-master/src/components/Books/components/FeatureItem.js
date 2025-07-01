import React from 'react';

function FeatureItem({ icon, title, description }) {
  // const IconComponent = icon; // إذا كنت تستخدم react-icons
  return (
    <div className="feature-item">
      {/* <IconComponent /> */}
      {icon} 
      {/* أو اعرض الـ SVG مباشرة هنا */}
      <div>
        {/* <h4>{title}</h4> */}
        {/* <p>{description}</p> */}
      </div>
    </div>
  );
}

export default FeatureItem;