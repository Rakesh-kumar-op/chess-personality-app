import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center p-2 mb-12 z-10">
        <button 
            onClick={() => navigate("/")}
            className="text-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
            <i className="fas fa-arrow-left"></i> Back to Menu
        </button>
      </header>

      {/* --- CONTACT CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-center gap-6 text-center p-6 z-10">
        <div className="relative bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300 ease-in-out max-w-2xl w-full">
          
          <h2 className="text-4xl font-bold text-white mb-8 tracking-wide font-['Space_Grotesk']">
            Meet the Team
          </h2>
          
          <div className="flex flex-col gap-6 text-left">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xl text-gray-200">
                    <span className="font-bold text-indigo-300 block text-sm uppercase tracking-wider mb-1">Developer</span>
                    Rakesh Kumar
                </p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xl text-gray-200">
                    <span className="font-bold text-pink-300 block text-sm uppercase tracking-wider mb-1">Designer</span>
                    Smruti Lipsa Nanda
                </p>
            </div>
          </div>

          {/* Glowing Background Blob */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10"></div>
        </div>
        
        <div className="mt-8 text-gray-500">
            <p>Have questions? Email us at <span className="text-[#8d756b]">support@gambits.com</span></p>
        </div>
      </main>

    </div>
  );
}

export default Contact;