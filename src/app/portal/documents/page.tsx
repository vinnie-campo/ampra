'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import {
  Upload,
  Camera,
  Video,
  FileText,
  Check,
  X,
  AlertCircle,
  Info,
  Image as ImageIcon,
  Trash2,
  Eye,
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  url?: string;
}

const requiredDocuments = [
  {
    id: 'main_panel',
    title: 'Main Electrical Panel',
    description: 'Clear photo of your main breaker panel with door open, showing all breakers',
    icon: Camera,
    tips: [
      'Ensure good lighting (use flash if needed)',
      'Capture the full panel including all labels',
      'Take from directly in front, not at an angle',
    ],
    required: true,
    uploaded: false,
  },
  {
    id: 'panel_label',
    title: 'Panel Label/Sticker',
    description: 'Close-up of the manufacturer label showing amps and model number',
    icon: Camera,
    tips: [
      'Usually inside the panel door',
      'Must be legible in the photo',
    ],
    required: true,
    uploaded: false,
  },
  {
    id: 'install_location',
    title: 'Installation Location',
    description: 'Photo of where you want the Powerwall installed (garage wall, exterior wall, etc.)',
    icon: Camera,
    tips: [
      'Show the full wall area',
      'Include any nearby obstacles',
      'Note if it\'s interior or exterior',
    ],
    required: true,
    uploaded: false,
  },
  {
    id: 'exterior_meter',
    title: 'Utility Meter',
    description: 'Photo of your electric meter on the exterior of your home',
    icon: Camera,
    tips: [
      'Show the full meter and surrounding area',
      'Capture the meter number if visible',
    ],
    required: true,
    uploaded: false,
  },
  {
    id: 'walkthrough_video',
    title: 'Video Walkthrough (Optional)',
    description: '30-60 second video walking from your panel to your proposed installation location',
    icon: Video,
    tips: [
      'Start at the electrical panel',
      'Walk slowly to show the path',
      'End at the proposed battery location',
    ],
    required: false,
    uploaded: false,
  },
  {
    id: 'utility_bill',
    title: 'Recent Utility Bill',
    description: 'PDF or photo of your most recent electric bill',
    icon: FileText,
    tips: [
      'Must show your account number',
      'Should be from the last 30 days',
    ],
    required: true,
    uploaded: false,
  },
];

const locationGuidelines = [
  {
    title: 'Indoor Installation',
    requirements: [
      'Temperature range: 32°F to 86°F (0°C to 30°C)',
      'At least 36 inches clearance in front',
      'Minimum 6 inches side clearance',
      'Cannot be in direct sunlight',
      'Must have wifi connectivity',
    ],
  },
  {
    title: 'Outdoor Installation',
    requirements: [
      'Sheltered from direct rain/weather',
      'Not in prolonged direct sunlight',
      'Within 50 feet of main panel',
      'Accessible for maintenance',
      'Level surface or wall mounting',
    ],
  },
];

export default function DocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = useCallback((docId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(docId, files);
  }, []);

  const handleFiles = (docId: string, files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: [...(prev[docId] || []), ...newFiles],
    }));

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles((prev) => ({
          ...prev,
          [docId]: prev[docId].map((f) =>
            f.id === file.id
              ? { ...f, progress, status: progress >= 100 ? 'complete' : 'uploading' }
              : f
          ),
        }));
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const removeFile = (docId: string, fileId: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: prev[docId].filter((f) => f.id !== fileId),
    }));
  };

  const getDocStatus = (docId: string) => {
    const files = uploadedFiles[docId] || [];
    if (files.length === 0) return 'pending';
    if (files.some((f) => f.status === 'uploading')) return 'uploading';
    if (files.every((f) => f.status === 'complete')) return 'complete';
    return 'pending';
  };

  const completedCount = requiredDocuments.filter(
    (doc) => doc.required && getDocStatus(doc.id) === 'complete'
  ).length;
  const requiredCount = requiredDocuments.filter((doc) => doc.required).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Site Survey Documents
        </h1>
        <p className="text-sand-600 mt-1">
          Upload the required photos and documents for your virtual site survey
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-900">
              Progress: {completedCount} of {requiredCount} required documents
            </span>
            <span className="text-sm text-sand-500">
              {Math.round((completedCount / requiredCount) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / requiredCount) * 100}%` }}
            />
          </div>
          {completedCount === requiredCount && (
            <p className="text-sm text-accent-600 mt-3 flex items-center gap-2">
              <Check className="w-4 h-4" />
              All required documents uploaded! We&apos;ll review and contact you within 1-2 business days.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Cards */}
        <div className="lg:col-span-2 space-y-4">
          {requiredDocuments.map((doc) => {
            const status = getDocStatus(doc.id);
            const files = uploadedFiles[doc.id] || [];

            return (
              <Card
                key={doc.id}
                className={cn(
                  'transition-all',
                  status === 'complete' && 'border-accent-300 bg-accent-50/30'
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        status === 'complete' ? 'bg-accent-100' : 'bg-sand-100'
                      )}
                    >
                      {status === 'complete' ? (
                        <Check className="w-6 h-6 text-accent-600" />
                      ) : (
                        <doc.icon className="w-6 h-6 text-sand-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                        {doc.required ? (
                          <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                            Required
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-sand-100 text-sand-600 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-sand-600 mb-4">{doc.description}</p>

                      {/* Tips */}
                      <div className="bg-sand-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-medium text-sand-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Photo Tips
                        </p>
                        <ul className="text-xs text-sand-600 space-y-1">
                          {doc.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-sand-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Uploaded Files */}
                      {files.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center gap-3 p-3 bg-white border border-sand-200 rounded-lg"
                            >
                              <ImageIcon className="w-5 h-5 text-sand-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {file.name}
                                </p>
                                {file.status === 'uploading' && (
                                  <div className="h-1 bg-sand-100 rounded-full mt-1 overflow-hidden">
                                    <div
                                      className="h-full bg-primary-500 transition-all"
                                      style={{ width: `${file.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                              {file.status === 'complete' && (
                                <Check className="w-5 h-5 text-accent-500" />
                              )}
                              <button
                                onClick={() => removeFile(doc.id, file.id)}
                                className="p-1 hover:bg-sand-100 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-sand-400 hover:text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Drop Zone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(doc.id);
                        }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => handleDrop(doc.id, e)}
                        className={cn(
                          'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                          dragOver === doc.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-sand-300 hover:border-primary-400 hover:bg-sand-50'
                        )}
                      >
                        <input
                          type="file"
                          id={`file-${doc.id}`}
                          className="hidden"
                          accept={doc.id === 'walkthrough_video' ? 'video/*' : 'image/*,application/pdf'}
                          multiple
                          onChange={(e) => {
                            if (e.target.files) handleFiles(doc.id, Array.from(e.target.files));
                          }}
                        />
                        <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                          <Upload className="w-8 h-8 text-sand-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-700">
                            Drop files here or click to upload
                          </p>
                          <p className="text-xs text-sand-500 mt-1">
                            {doc.id === 'walkthrough_video' ? 'MP4, MOV up to 100MB' : 'JPG, PNG, PDF up to 10MB'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sidebar - Installation Guidelines */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Installation Guidelines</CardTitle>
              <CardDescription>Location requirements based on local codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locationGuidelines.map((guideline) => (
                  <div key={guideline.title}>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">{guideline.title}</h4>
                    <ul className="space-y-2">
                      {guideline.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-sand-600">
                          <Check className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Important Note</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Final installation location will be confirmed by our team after reviewing your photos. 
                      We may suggest alternatives based on local permitting requirements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
