import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/solid';

const ImageUploader = ({ onFileSelect, existingImage = null }) => {
  const [preview, setPreview] = useState(existingImage);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false
  });

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}`}>
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-md" />
          <button 
            onClick={removeImage} 
            className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
            <XCircleIcon className="h-6 w-6 text-red-500" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <ArrowUpTrayIcon className="h-10 w-10 mb-2" />
          {isDragActive ?
            <p>Drop the image here ...</p> : 
            <p>Drag 'n' drop an image here, or click to select one</p>
          }
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
