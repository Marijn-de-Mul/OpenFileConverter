import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from 'react';
import Base from '~/components/base';
import { fetchAvailableConversions, convertFile } from '~/utils/api';

export const meta: MetaFunction = () => {
  return [
    { title: "OpenFileConverter" },
    { name: "description", content: "Convert your files easily with OpenFileConverter!" },
  ];
};

export default function Index() {
  const [formats, setFormats] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop() || '';
      fetchAvailableConversions(extension).then(setFormats);
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setConvertedFileUrl(null); 
      setConvertedFileName(null); 
    }
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !selectedFormat) return;

    setLoading(true);

    const { url, fileName } = await convertFile(selectedFormat, selectedFile);

    setConvertedFileUrl(url);
    setConvertedFileName(fileName);

    setLoading(false);
  };

  const handleConvertMore = () => {
    setSelectedFile(null);
    setSelectedFormat('');
    setConvertedFileUrl(null);
    setConvertedFileName(null);
    setFormats([]);
  };

  const formatDisplayName = (endpoint: string) => {
    const parts = endpoint.split('-to-');
    if (parts.length === 2) {
      return `To ${parts[1].toUpperCase()}`;
    }
    return endpoint;
  };

  return (
    <Base>
      <div className="flex flex-col items-center justify-center flex-grow">
        <header className="flex flex-col items-center gap-4 mt-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to OpenFileConverter
          </h1>
          <p className="text-gray-700 dark:text-gray-200">
            Convert your files easily and quickly.
          </p>
        </header>
        <main className="flex flex-col items-center justify-center flex-grow w-full">
          <div className="w-full max-w-md p-4 bg-white rounded shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              File Conversion
            </h2>
            {!convertedFileUrl ? (
              <form className="mt-4 w-full" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200" htmlFor="file">
                    Choose file to convert:
                  </label>
                  <input
                    type="file"
                    id="file"
                    className="w-full px-3 py-2 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={handleFileChange}
                  />
                </div>
                {formats.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200" htmlFor="format">
                      Select format:
                    </label>
                    <select
                      id="format"
                      className="w-full px-3 py-2 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      onChange={handleFormatChange}
                    >
                      <option value="">Select format</option>
                      {formats.map((format, index) => (
                        <option key={index} value={format}>{formatDisplayName(format)}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Converting...' : 'Convert'}
                </button>
              </form>
            ) : (
              <>
                <a
                  href={convertedFileUrl}
                  download={convertedFileName}
                  className="mt-4 inline-block px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Download Converted File
                </a>
                <button
                  onClick={handleConvertMore}
                  className="ml-4 mt-4 inline-block px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Convert More Files
                </button>
              </>
            )}
            {loading && <p className="mt-4 text-blue-600">Converting file, please wait...</p>}
          </div>
        </main>
      </div>
    </Base>
  );
}