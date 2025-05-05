import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { FaSearch, FaUpload, FaLink, FaTimes, FaSpinner } from 'react-icons/fa';

interface SearchBarProps {
  onSearchByUrl: (url: string) => void;
  onSearchByFile: (file: File) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchByUrl, onSearchByFile, isLoading }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null); // Local error for input validation
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearError = () => setError(null);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearError();
    setImageUrl(e.target.value);
    if (selectedFile) { // Clear file if URL is typed
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input visually
    }
  };

  const handleFileChange = (file: File | null) => {
    clearError();
    if (file) {
      // Validation
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Invalid file type. Please select an image or video.');
        return;
      }
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        setError('File is too large. Maximum size is 25MB.');
        return;
      }

      setSelectedFile(file);
      setImageUrl(''); // Clear URL
      // Create a preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null); // No preview for video (or use a placeholder)
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };

  const handleUrlSearch = () => {
    clearError();
    if (!imageUrl.trim()) {
      setError("Please enter an image URL.");
      return;
    }
    try {
      // Basic URL validation
      new URL(imageUrl.trim());
      onSearchByUrl(imageUrl.trim());
    } catch (_) {
      setError("Invalid URL format.");
    }
  };

  const handleFileSearch = () => {
    clearError();
    if (!selectedFile) return;
    onSearchByFile(selectedFile);
  };

  const triggerFileSelect = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    clearError();
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (isLoading) return;
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); // Necessary to allow drop
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (isLoading) return;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const canSearch = (!!imageUrl.trim() || !!selectedFile) && !isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-surface rounded-xl shadow-2xl border border-surface relative">

       {/* Loading Overlay */}
      {isLoading && (
          <div className="absolute inset-0 bg-base/50 flex flex-col items-center justify-center rounded-xl z-20">
              <FaSpinner className="animate-spin text-primary h-10 w-10 mb-3"/>
              <p className="text-muted">Searching...</p>
          </div>
      )}

      {/* URL Input */}
      <div className="flex items-center space-x-2 mb-4 relative">
        <FaLink className="text-muted flex-shrink-0" size={18} />
        <input
          type="url"
          placeholder="Paste image or video URL"
          value={imageUrl}
          onChange={handleUrlChange}
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleUrlSearch()}
          className="flex-grow p-3 bg-base border border-surface rounded-md text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {imageUrl && !isLoading && (
           <button onClick={clearSelection} className="absolute right-14 top-1/2 transform -translate-y-1/2 text-muted hover:text-main p-1 rounded-full" title="Clear input">
               <FaTimes size={16}/>
           </button>
        )}
        <button
          onClick={handleUrlSearch}
          disabled={!imageUrl.trim() || isLoading}
          className="p-3 bg-primary text-main rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Search by URL"
        >
          <FaSearch size={20} />
        </button>
      </div>

      <div className="text-center text-muted my-4 text-sm font-semibold">OR</div>

      {/* File Upload / Drop Zone */}
      <div
        className={`relative border-2 ${isDragging ? 'border-primary bg-base/50' : 'border-surface border-dashed'} rounded-lg p-6 text-center cursor-pointer hover:border-primary transition group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={triggerFileSelect}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*,video/*"
          className="hidden"
          disabled={isLoading}
        />
        <FaUpload className={`mx-auto h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted group-hover:text-primary'} transition`} />
        <p className={`mt-2 text-sm ${isDragging ? 'text-primary' : 'text-muted group-hover:text-primary'} transition`}>
          {isDragging ? 'Drop file here!' : 'Drag & drop image/video, or click to select'}
        </p>
        <p className="text-xs text-muted mt-1">Max file size: 25MB</p>
      </div>

      {/* Validation Error Display */}
      {error && (
          <p className="text-error text-sm mt-2 text-center">{error}</p>
      )}

      {/* File Preview and Upload Button */}
      {selectedFile && (
        <div className="mt-5 text-center bg-base p-4 rounded-lg relative">
           <button onClick={clearSelection} className="absolute top-2 right-2 text-muted hover:text-main" title="Clear selection">
               <FaTimes />
           </button>
          {previewUrl && selectedFile.type.startsWith('image/') && (
            <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-md shadow mb-3 border border-surface" />
          )}
          {!previewUrl && selectedFile.type.startsWith('video/') && (
            <div className="h-20 flex items-center justify-center bg-surface rounded-md mb-3 text-muted text-sm">
                Video Selected
            </div>
          )}
          <p className="text-sm text-main mb-3 truncate px-4" title={selectedFile.name}>
            Selected: <span className="font-medium">{selectedFile.name}</span>
          </p>
          <button
            onClick={handleFileSearch}
            disabled={isLoading || !selectedFile}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-main bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch className="-ml-1 mr-2 h-5 w-5" />
            Search with File
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;