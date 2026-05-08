import { Zap, Globe, RefreshCw, Shield } from 'lucide-react';

const About = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0f0f12] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-yellow-500 mb-6 hover:underline">← Back to Home</button>
        
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-10 h-10 text-yellow-500" />
          <h1 className="text-3xl font-black">About KhabarBlast</h1>
        </div>
        
        <p className="text-gray-300 text-lg mb-8">
          KhabarBlast is your one-stop destination for the latest breaking news, trending stories, and in-depth coverage from around the world. We aggregate news from trusted sources to bring you the most relevant and up-to-date information 24/7.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 mb-8">
          To provide fast, accurate, and accessible news to readers worldwide. We believe everyone deserves access to quality journalism and timely information about events that shape our world.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-xl">
            <Globe className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold mb-1">Global Coverage</h3>
            <p className="text-gray-400 text-sm">News from India and around the world across 12+ categories</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <RefreshCw className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold mb-1">24/7 Updates</h3>
            <p className="text-gray-400 text-sm">Auto-refreshing content keeps you updated in real-time</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <Zap className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold mb-1">Fast & Light</h3>
            <p className="text-gray-400 text-sm">Optimized for speed with minimal data usage</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <Shield className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold mb-1">Trusted Sources</h3>
            <p className="text-gray-400 text-sm">We aggregate from verified and reputable news outlets</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <p className="text-gray-300 mb-4">We cover a wide range of topics including:</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {['Top Stories', 'India', 'World', 'Technology', 'Entertainment', 'Sports', 'Business', 'Politics', 'Viral', 'Gaming', 'Crypto', 'Health'].map(cat => (
            <span key={cat} className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm">{cat}</span>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
        <p className="text-gray-300 mb-4">
          KhabarBlast is a news aggregation platform. We do not create or own the news content displayed on this website. All articles link directly to their original sources. Trademarks and copyrights belong to their respective owners.
        </p>
      </div>
    </div>
  );
};

export default About;
