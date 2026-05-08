import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = ({ onBack }: { onBack: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white py-20 px-4">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="text-yellow-500 mb-6 hover:underline">← Back to Home</button>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-black">Contact Us</h1>
        </div>
        <p className="text-gray-300 mb-8">Have a question, suggestion, or feedback? We would love to hear from you! Fill out the form below and we will get back to you as soon as possible.</p>
        {submitted ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-300">Your message has been sent. We will get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-yellow-500 hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-xl font-bold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300"><Mail className="w-5 h-5 text-yellow-500" /><span>khabarblast24@gmail.com</span></div>
            <div className="flex items-center gap-3 text-gray-300"><MessageSquare className="w-5 h-5 text-yellow-500" /><span>Response time: Within 24-48 hours</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
