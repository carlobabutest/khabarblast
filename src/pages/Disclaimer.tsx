const Disclaimer = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-yellow-500 mb-6 hover:underline">← Back to Home</button>
        <h1 className="text-3xl font-black mb-6">Disclaimer</h1>
        <div className="prose prose-invert prose-sm">
          <p className="text-gray-400 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">1. News Aggregation</h2>
          <p className="text-gray-300 mb-4">KhabarBlast is a news aggregation website. We collect and display headlines and snippets from various third-party news sources. We do not create, edit, or own any of the news content displayed on our website. All news articles link directly to their original sources.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">2. No Endorsement</h2>
          <p className="text-gray-300 mb-4">The appearance of news content on KhabarBlast does not constitute an endorsement of the views, opinions, or information contained therein. We are not responsible for the accuracy, completeness, or reliability of any information provided by third-party sources.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">3. Third-Party Content</h2>
          <p className="text-gray-300 mb-4">All trademarks, logos, and images belong to their respective owners. If you believe your copyrighted content has been used inappropriately, please contact us immediately.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">4. Fair Use</h2>
          <p className="text-gray-300 mb-4">Our use of news headlines and brief snippets falls under fair use for the purpose of news reporting and commentary. We always provide attribution and direct links to original sources.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">5. Advertisements</h2>
          <p className="text-gray-300 mb-4">This website contains advertisements provided by third-party advertising networks. We are not responsible for the content of these advertisements. Please refer to the respective advertiser's terms and privacy policies.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">6. No Liability</h2>
          <p className="text-gray-300 mb-4">KhabarBlast shall not be liable for any damages arising from the use of this website or reliance on any information provided herein. Use this website at your own risk.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">7. Changes</h2>
          <p className="text-gray-300 mb-4">We reserve the right to modify this disclaimer at any time. Continued use of the website constitutes acceptance of any changes.</p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">8. Contact</h2>
          <p className="text-gray-300 mb-4">For any concerns regarding content or copyright issues, please contact us through our Contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
