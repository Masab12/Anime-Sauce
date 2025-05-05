import React from 'react';
import { FaExternalLinkAlt, FaImage, FaVideo, FaExclamationTriangle } from 'react-icons/fa';

// --- Interfaces (Define data structure) ---
interface AnilistTitle {
  native?: string;
  romaji?: string;
  english?: string;
}

interface AnilistInfo {
  id: number;
  idMal: number | null;
  title: AnilistTitle;
  synonyms: string[];
  isAdult: boolean;
}

export interface TraceResult {
  anilist: AnilistInfo | number; // Can be number if anilistInfo is not requested
  filename: string;
  episode: number | string | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

interface ResultCardProps {
  result: TraceResult;
  onMakeMeme: (imageUrl: string) => void; // Callback to trigger meme generator
}

// --- Helper Functions ---
const formatTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8); // HH:MM:SS format
};

const getTitle = (anilist: AnilistInfo | number): string => {
  if (typeof anilist === 'number') return `Anilist ID: ${anilist}`;
  return anilist.title.romaji || anilist.title.english || anilist.title.native || `Anilist ID: ${anilist.id}`;
};

const getAnilistUrl = (anilist: AnilistInfo | number): string | null => {
  const id = typeof anilist === 'number' ? anilist : anilist.id;
  return `https://anilist.co/anime/${id}`;
};

// --- Component ---
const ResultCard: React.FC<ResultCardProps> = ({ result, onMakeMeme }) => {
  const anilistInfo = typeof result.anilist === 'object' ? result.anilist : null;
  const similarityPercentage = (result.similarity * 100).toFixed(2);
  const anilistUrl = getAnilistUrl(result.anilist);

  const similarityColor =
    result.similarity > 0.95
      ? 'text-success border-success'
      : result.similarity > 0.89
      ? 'text-warning border-warning'
      : 'text-text-muted border-text-muted';

  return (
    <div className={`bg-surface rounded-lg shadow-xl overflow-hidden border-l-4 ${similarityColor} my-6 animate-fade-in transition duration-300 ease-in-out hover:shadow-2xl hover:border-primary-light`}>
      <div className="md:flex">
        {/* Preview Section */}
        <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-base/50">
          <p className="text-sm text-muted mb-3 font-semibold">Scene Preview</p>
          <div className="relative w-full mb-3 group">
            <img
              src={result.image}
              alt="Scene Preview Thumbnail"
              className="rounded-md shadow-md w-full object-contain max-h-48 border border-surface"
              loading="lazy"
            />
            <a href={result.image} target="_blank" rel="noopener noreferrer" title="Open full image" className="absolute top-1 right-1 bg-black/50 text-main p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaImage size={14}/>
            </a>
          </div>
          <div className="relative w-full group">
            <video
              src={result.video}
              controls
              muted
              preload="metadata"
              className="rounded-md shadow-md w-full max-h-48 border border-surface"
            >
              Your browser doesn't support embedded videos.
            </video>
             <a href={result.video} target="_blank" rel="noopener noreferrer" title="Open video" className="absolute top-1 right-1 bg-black/50 text-main p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaVideo size={14}/>
            </a>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:w-2/3 p-5">
          <h3 className="text-xl lg:text-2xl font-semibold text-primary-light mb-2 flex items-center flex-wrap">
            {getTitle(result.anilist)}
            {anilistUrl && (
              <a
                href={anilistUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Anilist"
                className="ml-2 text-muted hover:text-accent-blue transition-colors"
              >
                <FaExternalLinkAlt size={16} />
              </a>
            )}
          </h3>

          {anilistInfo?.title?.english && anilistInfo.title.english !== anilistInfo.title.romaji && (
            <p className="text-sm text-muted mb-1">English: {anilistInfo.title.english}</p>
          )}
          {anilistInfo?.title?.native && (
            <p className="text-sm text-muted mb-3">Native: {anilistInfo.title.native}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
            <div>
              <span className="font-medium text-muted">Episode:</span>
              <span className="ml-1.5 text-main">{result.episode ?? 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-muted">Timestamp:</span>
              <span className="ml-1.5 text-main">{formatTime(result.from)} - {formatTime(result.to)}</span>
            </div>
            <div>
              <span className="font-medium text-muted">Similarity:</span>
              <span className={`ml-1.5 font-bold ${similarityColor.split(' ')[0]}`}>{similarityPercentage}%</span>
            </div>
            {anilistInfo?.isAdult && (
              <div className="text-error font-semibold flex items-center">
                <FaExclamationTriangle className="mr-1.5" /> Adult Content
              </div>
            )}
          </div>

          {/* Meme Button */}
          <button
             onClick={() => onMakeMeme(result.image)} // Pass the preview image URL
             className="mt-4 px-4 py-2 bg-accent text-main rounded-md text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface transition duration-150 ease-in-out"
          >
             Create Meme from Scene
          </button>

          <p className="text-xs text-muted mt-5 pt-2 border-t border-surface break-all">
            <span className="font-medium">Source File:</span> {result.filename}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;