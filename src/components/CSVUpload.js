'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function CSVUpload({ type, onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/${type}/bulk-import`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully imported ${data.imported} ${type}`,
          imported: data.imported,
          errors: data.errors || [],
        });
        if (onUploadComplete) {
          onUploadComplete(data);
        }
      } else {
        setResult({
          success: false,
          message: data.error || 'Upload failed',
          errors: data.errors || [],
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred during upload',
        errors: [],
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    let csvContent = '';

    if (type === 'candidates') {
      csvContent = 'firstName,lastName,email,phone,location,currentTitle,currentCompany,yearsExperience,skills,linkedinUrl,status,source,desiredSalary,desiredRole,availability\n';
      csvContent += 'John,Doe,john@example.com,555-1234,New York,Software Engineer,Tech Corp,5,"JavaScript,React,Node.js",https://linkedin.com/in/johndoe,active,linkedin,$150000,Senior Engineer,immediate\n';
    } else if (type === 'companies') {
      csvContent = 'name,industry,website,size,location,description,status\n';
      csvContent += 'Tech Corp,Technology,https://techcorp.com,51-200,San Francisco,Leading software company,active\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Bulk Import {type === 'candidates' ? 'Candidates' : 'Companies'}
        </h3>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${file ? 'bg-gray-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-blue-600" />
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">
              Drop your CSV file here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Supports .csv files</p>
          </>
        )}
      </div>

      {/* Upload Button */}
      {file && !result && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import {type === 'candidates' ? 'Candidates' : 'Companies'}
            </>
          )}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-700">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside mt-1 max-h-32 overflow-y-auto">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.errors.length > 10 && (
                      <li>...and {result.errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={clearFile}
            className="mt-3 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  );
}
