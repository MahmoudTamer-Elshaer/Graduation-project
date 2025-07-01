import React from 'react';

export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-cover bg-center flex flex-col items-center justify-center text-white" style={{ backgroundImage: 'url(/path-to-your-background.jpg)' }}>
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Translate Your Documents Instantly</h1>
          <p className="text-lg md:text-xl mb-6">Fast, accurate, and secure translation for all your files at your fingertips.</p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold">Click to Upload</button>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Book Cards */}
            {["One Mind", "The Little Prince", "The Power of Agency", "The Alchemist", "A Game of Thrones", "Factfulness"].map((title, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md text-center">
                <div className="h-40 bg-gray-200 mb-2"></div> {/* Placeholder for image */}
                <h3 className="text-sm font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Choose Lexi Read?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              "Instant Translation While Reading",
              "New Vocabulary & Extensive Learning",
              "Writing Enhancement & Proofreading",
              "OCR Support for Image Translation",
              "AI Powered Text Understanding",
              "Seamless Multi-Platform Experience"
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-blue-100 rounded-xl shadow hover:shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Discover it now on the App Store!</h2>
          <p className="mb-6">Unlock a smarter way to read - Download Lexi Read and dive into your language adventure today!</p>
          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold">Get it on App Store</button>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold">Get it on Google Play</button>
          </div>
        </div>
      </section>
    </div>
  );
}