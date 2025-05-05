import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { FaTimes, FaDownload, FaPaintBrush } from 'react-icons/fa';

interface MemeGeneratorProps {
  imageUrl: string;
  onClose: () => void;
}

const MemeGenerator: React.FC<MemeGeneratorProps> = ({ imageUrl, onClose }) => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const memeContainerRef = useRef<HTMLDivElement>(null);

  const handleGenerateMeme = async () => {
    if (!memeContainerRef.current) return;

    setIsGenerating(true);
    setGeneratedMemeUrl(null); // Clear previous

    try {
      // Ensure image is loaded before capturing (important for cross-origin)
      const imageElement = memeContainerRef.current.querySelector('img');
      if (imageElement && !imageElement.complete) {
        await new Promise(resolve => { imageElement.onload = resolve; });
      }

      const canvas = await html2canvas(memeContainerRef.current, {
        useCORS: true, // Attempt to capture cross-origin images
        allowTaint: true, // May be needed depending on image source
        backgroundColor: '#000000', // Set background for potential transparency
        logging: false, // Disable console logs from html2canvas
        scale: window.devicePixelRatio * 1.5 // Increase scale for better resolution
      });
      const dataUrl = canvas.toDataURL('image/png');
      setGeneratedMemeUrl(dataUrl);
    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Could not generate meme. The image might be protected (CORS issue) or an error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedMemeUrl) return;
    const link = document.createElement('a');
    link.href = generatedMemeUrl;
    link.download = 'trace-meme.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Basic Meme Text Styling (can be customized further)
  const memeTextStyle: React.CSSProperties = {
    fontFamily: '"Impact", "Arial Black", sans-serif', // Classic meme font
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', // Responsive font size
    fontWeight: 'bold',
    color: 'white',
    textShadow: `
      -2px -2px 0 #000,
       2px -2px 0 #000,
      -2px  2px 0 #000,
       2px  2px 0 #000,
      -3px -3px 2px #000,
       3px -3px 2px #000,
      -3px  3px 2px #000,
       3px  3px 2px #000`, // Thick black outline
    textAlign: 'center',
    textTransform: 'uppercase',
    position: 'absolute',
    left: '5%',
    right: '5%',
    wordBreak: 'break-word',
    zIndex: 10, // Ensure text is above image
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-base/75 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-surface rounded-xl p-6 max-w-2xl w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-muted hover:text-main transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-main mb-6">Create Meme</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="topText" className="block text-sm font-medium text-muted mb-1">
              Top Text
            </label>
            <input
              type="text"
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full p-2 bg-base border border-surface rounded-md text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter top text"
            />
          </div>
          <div>
            <label htmlFor="bottomText" className="block text-sm font-medium text-muted mb-1">
              Bottom Text
            </label>
            <input
              type="text"
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full p-2 bg-base border border-surface rounded-md text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter bottom text"
            />
          </div>
        </div>

        <div 
          ref={memeContainerRef}
          className="relative max-w-xl mx-auto mb-6"
        >
          <img
            src={imageUrl}
            alt="Meme template"
            className="w-full rounded-lg shadow-xl"
            crossOrigin="anonymous"
          />
          {topText && (
            <div className="absolute top-4 left-0 right-0 text-center">
              <p className="text-3xl md:text-4xl font-bold text-main uppercase break-words px-4 stroke-text">
                {topText}
              </p>
            </div>
          )}
          {bottomText && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-3xl md:text-4xl font-bold text-main uppercase break-words px-4 stroke-text">
                {bottomText}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerateMeme}
            disabled={isGenerating}
            className="inline-flex items-center px-6 py-3 bg-primary text-main rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            <FaPaintBrush className="mr-2"/>
            {isGenerating ? 'Generating...' : 'Generate Meme Image'}
          </button>
          {generatedMemeUrl && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-primary text-main rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              <FaDownload className="mr-2" />
              Download Meme
            </button>
          )}
        </div>

        {generatedMemeUrl && (
          <p className="text-xs text-center text-muted mt-3">Click Download to save your creation!</p>
        )}
        {!generatedMemeUrl && !isGenerating && (
          <p className="text-xs text-center text-muted mt-3">Add text and click Generate.</p>
        )}
      </div>
    </div>
  );
};

export default MemeGenerator;