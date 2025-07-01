
import React, { useState, useRef } from 'react';
import axios from 'axios';

// أيقونة رفع (نفس السابقة)
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20" style={{marginLeft: '8px'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
);

const API_BASE_URL = "http://app.elfar5a.com";

const USER_TOKEN = localStorage.getItem("authToken");

function HeroSection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [author, setAuthorName] = useState(''); // حالة لاسم المؤلف
  const [description, setDescription] = useState(''); // حالة للوصف
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // دالة لفتح مربع حوار اختيار الملف
  const handleTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  // دالة لمعالجة اختيار الملف
  const handleFileSelectChange = (event) => {
    const file = event.target.files[0];
    setUploadResult(null); // مسح أي نتيجة رفع سابقة
    setError(null);       // مسح أي خطأ سابق

    if (file) {
      setSelectedFile(file);
      // يمكنك هنا التحقق من نوع الملف وحجمه إذا أردت
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setError(`نوع الملف غير مدعوم. الأنواع المسموح بها: ${allowedTypes.join(', ')}`);
        setSelectedFile(null); // إلغاء اختيار الملف غير المدعوم
        if (fileInputRef.current) fileInputRef.current.value = ""; // مسح قيمة input file
        return;
      }
    } else {
      setSelectedFile(null);
    }
  };


  const handleSubmitUpload = async () => {
    if (!selectedFile) {
      setError("الرجاء اختيار ملف أولاً.");
      return;
    }
    
    if (!author.trim()) {
      setError("الرجاء إدخال اسم المؤلف.");
      return;
    }
    if (!description.trim()) {
      setError("الرجاء إدخال وصف للمستند.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('author_name', author); 
    formData.append('description', description); 

    setUploading(true);
    setUploadResult(null);
    setError(null);

    try {
      const response = await axios.post(
        // `${API_BASE_URL}/api/document/store`,
        `${API_BASE_URL}/api/document/convert-to-html`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
            
            Accept: 'application/json',
          },
        }
      );
      setUploadResult(response.data);
      // مسح الحقول بعد الرفع الناجح
      setSelectedFile(null);
      setAuthorName('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      alert("“File uploaded successfully! Check My Books ⬇️"); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "حدث خطأ أثناء رفع الملف.";
      let detailedErrors = "";
      
      if (err.response?.data?.errors) {
        detailedErrors = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join(' | ');
        setError(`${errorMessage} (التفاصيل: ${detailedErrors})`);
      } else {
        setError(errorMessage);
      }
      console.error("تفاصيل الخطأ:", err.response?.data || err.config || err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="hero-section">
        <h1>Translate Your Documents Instantly</h1>
        <p>Fast, accurate, and secure translation for all your files — at your fingertips.</p>

        <div className="upload-container">
            {/* Input مخفي لاختيار الملف */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelectChange} 
                accept=".pdf,.doc,.docx,.txt" 
            />

            {/* زر لاختيار الملف */}
            <button 
                className="upload-button" 
                onClick={handleTriggerFileInput} 
                disabled={uploading}
                
            >
                {selectedFile ? `Selected: ${selectedFile.name}` : <>Click to Select File <UploadIcon /></>}
            </button>

            {/* عرض حقول الإدخال للمؤلف والوصف وزر الرفع إذا تم اختيار ملف */}
            {selectedFile && !uploading && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px',width: "100%" }}>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="author" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold',color: "gray" }}>Author Name:</label>
                  <input className='outher_input'
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter author's name"
                    disabled={uploading}
                    style={{color: "white", padding: '10px', width: '100%', maxWidth: '400px', border: '1px solid #eee', borderRadius: '50px', backgroundColor: "#E1AB48"}}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold',color: "gray" }}>Description:</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description"
                    disabled={uploading}
                    rows="3"
                    // style={{ padding: '10px', width: '80%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                    style={{position: "relative",right: "60px" ,color: "white", padding: '10px', width: '140%', maxWidth: '4000px', border: '1px solid #eee', borderRadius: '50px', backgroundColor: "#E1AB48"}}
                  />
                </div>
                
                <button 
                  className="upload-button-submit" // يمكنك استخدام كلاس مختلف لزر الإرسال
                  onClick={handleSubmitUpload} 
                  disabled={uploading}
                  style={{ padding: '12px 25px', fontSize: '17px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  {uploading ? "Uploading..." : "Upload Now"}
                </button>
              </div>
            )}
            
            {/* حالة الرفع */}
            {uploading && <p style={{marginTop: '10px', color: '#007bff'}}>Uploading, please wait...</p>}


            {/* نتيجة الرفع */}
            {uploadResult && (
                <div className="upload-success" style={{ color: "green", marginTop: '15px', padding: '10px', border: '1px solid green', borderRadius: '4px', background: '#e6ffed' }}>
                  ✅ File uploaded successfully! look "my books"
                  {/* يمكنك عرض بعض البيانات من response.data إذا أردت */}
                  {/* <pre>{JSON.stringify(uploadResult, null, 2)}</pre> */}
                </div>
            )}
            {error && (
                <div className="upload-error" style={{ color: "red", marginTop: '15px', padding: '10px', border: '1px solid red', borderRadius: '4px', background: '#ffebee' }}>
                  Error: {error}
                </div>
            )}

             <p className="supported-formats" style={{marginTop: '20px', fontSize: '0.9em', color: '#777'}}>
               {/* Supported formats: .pdf, .doc, .docx, .txt */}
             </p>
        </div>
    </section>
  );
}

export default HeroSection;
