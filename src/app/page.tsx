'use client'; // This page requires client-side interactivity

import React, { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import ResultsDisplay from '@/components/ResultsDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import MemeGenerator from '@/components/MemeGenerator'; // Import the new component
import { TraceResult } from '@/components/ResultCard'; // Import shared interface

// Define the structure of the API response
interface ApiResponse {
    frameCount: number;
    error: string;
    result: TraceResult[];
}

export default function HomePage() {
  // State variables
  const [results, setResults] = useState<TraceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMemeGenerator, setShowMemeGenerator] = useState(false);
  const [memeImageUrl, setMemeImageUrl] = useState<string | null>(null);

  // API Endpoint (requesting Anilist info by default)
  const TRACE_API_BASE_URL = 'https://api.trace.moe/search?anilistInfo';

  // --- Search Logic ---
  const performSearch = useCallback(async (url: string, options: RequestInit) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      const data: ApiResponse = await response.json(); // Always try to parse JSON

      // Check for HTTP errors first
      if (!response.ok) {
        // Use error message from API response if available, otherwise use status text
        throw new Error(data?.error || `Server responded with ${response.status}`);
      }

      // Check for logical errors reported in the JSON body
      if (data.error) {
        throw new Error(data.error);
      }

      // Sort results by similarity (descending) - API usually does this, but ensures consistency
      const sortedResults = data.result.sort((a, b) => b.similarity - a.similarity);

      setResults(sortedResults);

    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || 'An error occurred during the search');
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback avoids recreating function on every render

  const handleSearchByUrl = useCallback((url: string) => {
    const encodedUrl = encodeURIComponent(url);
    const searchUrl = `${TRACE_API_BASE_URL}&url=${encodedUrl}`;
    performSearch(searchUrl, { method: 'GET' });
  }, [performSearch]);

  const handleSearchByFile = useCallback((file: File) => {
    // For file uploads, the file goes in the body, no need to modify URL params
    const requestOptions: RequestInit = {
      method: 'POST',
      body: file,
      // Content-Type header is set automatically by the browser for FormData/File uploads
    };
    performSearch(TRACE_API_BASE_URL, requestOptions);
  }, [performSearch]);


  // --- Meme Generator Logic ---
  const handleOpenMemeGenerator = useCallback((imageUrl: string) => {
    setMemeImageUrl(imageUrl);
    setShowMemeGenerator(true);
  }, []);

  const handleCloseMemeGenerator = useCallback(() => {
    setShowMemeGenerator(false);
    setMemeImageUrl(null); // Clear the image URL when closing
  }, []);


  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center w-full">
      <header className="text-center mb-10 md:mb-14">
         {/* Optional: Add a nice SVG logo or image here */}
         {/* <img src="/logo.svg" alt="Anime Scene Finder Logo" className="mx-auto mb-4 h-16 w-auto"/> */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent-blue mb-3">
          Anime Scene Finder
        </h1>
        <p className="text-lg text-text-muted max-w-xl mx-auto">
          Upload an anime screenshot or paste an image URL to find the exact scene and episode!
        </p>
      </header>

      {/* Search Bar Component */}
      <SearchBar
        onSearchByUrl={handleSearchByUrl}
        onSearchByFile={handleSearchByFile}
        isLoading={isLoading}
      />

      {/* Results Area */}
      <div className="w-full max-w-5xl mt-10">
        {/* Display Loading Spinner */}
        {isLoading && (
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Display Error Message */}
        {!isLoading && error && <ErrorDisplay message={error} />}

        {/* Display Results */}
        {!isLoading && !error && results.length > 0 && (
          <ResultsDisplay results={results} onMakeMeme={handleOpenMemeGenerator} />
        )}

        {/* Initial State Message (Optional) */}
        {!isLoading && !error && results.length === 0 && (
            <div className="text-center text-text-muted mt-16">
                <p>Ready to find that scene?</p>
                <p className="text-sm mt-1">Upload an image or paste a URL above.</p>
            </div>
        )}
      </div>

      {/* Meme Generator Modal (Conditionally Rendered) */}
      {showMemeGenerator && memeImageUrl && (
        <MemeGenerator
          imageUrl={memeImageUrl}
          onClose={handleCloseMemeGenerator}
        />
      )}
    </div>
  );
}