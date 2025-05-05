import React from 'react';
import ResultCard, { TraceResult } from '@/components/ResultCard';

interface ResultsDisplayProps {
  results: TraceResult[];
  onMakeMeme: (imageUrl: string) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onMakeMeme }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center my-12 p-8 bg-surface rounded-lg shadow animate-fade-in">
        <p className="text-xl text-muted">No matching scenes found.</p>
        <p className="text-sm text-muted mt-2">Maybe try a different frame or check the image quality?</p>
      </div>
    );
  }

  const highConfidenceResults = results.filter(r => r.similarity >= 0.87);
  const lowConfidenceResults = results.filter(r => r.similarity < 0.87);

  return (
    <div className="mt-10 w-full">
      <h2 className="text-2xl md:text-3xl font-semibold text-main mb-6 border-b border-surface pb-3">
        Search Results
      </h2>
      {highConfidenceResults.length > 0 && (
        <>
          {highConfidenceResults.map((result, index) => (
            <ResultCard
              key={`high-${result.filename}-${result.from}-${index}`}
              result={result}
              onMakeMeme={onMakeMeme}
            />
          ))}
        </>
      )}
      {lowConfidenceResults.length > 0 && (
        <>
          <h3 className="text-lg font-medium text-muted mt-8 mb-4">Potentially Similar Scenes (Lower Confidence):</h3>
          {lowConfidenceResults.map((result, index) => (
            <ResultCard
              key={`low-${result.filename}-${result.from}-${index}`}
              result={result}
              onMakeMeme={onMakeMeme}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;