const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-yellow-500 mb-6 hover:underline">← Back to Home</button>
        <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
        <p className="text-gray-400 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h2>
        <p className="text-gray-300 mb-4">We collect information you provide directly to us, such as when you contact us. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">2. Use of Information</h2>
        <p className="text-gray-300 mb-4">We use the information we collect to operate, maintain, and improve our website, to send you technical notices and support messages, and to respond to your comments and questions.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">3. Cookies</h2>
        <p className="text-gray-300 mb-4">We use cookies and similar tracking technologies to track activity on our website. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">4. Advertising</h2>
        <p className="text-gray-300 mb-4">We may use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">5. Third-Party Links</h2>
        <p className="text-gray-300 mb-4">Our website may contain links to third-party websites. We have no control over the content, privacy policies, or practices of any third-party sites or services.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">6. Data Security</h2>
        <p className="text-gray-300 mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">7. Changes to This Policy</h2>
        <p className="text-gray-300 mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">8. Contact Us</h2>
        <p className="text-gray-300 mb-4">If you have any questions about this Privacy Policy, please contact us through our Contact page.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
