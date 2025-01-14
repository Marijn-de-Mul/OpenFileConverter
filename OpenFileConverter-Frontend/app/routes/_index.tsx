import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from 'react';
import Base from '~/components/base';

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
      const extension = selectedFile.name.split('.').pop();
      fetch(`https://localhost:7195/api/Conversion/available-conversions/.${extension}`)
        .then(response => response.json())
        .then(data => setFormats(data.endpoints))
        .catch(error => console.error('Error fetching conversion formats:', error));
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setConvertedFileUrl(null); // Reset the converted file URL
      setConvertedFileName(null); // Reset the converted file name
    }
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !selectedFormat) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('inputFile', selectedFile);

    try {
      const response = await fetch(`https://localhost:7195/${selectedFormat}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const contentDisposition = response.headers.get('content-disposition');
        const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/);
        const fileName = fileNameMatch ? fileNameMatch[1] : `converted-file.${selectedFormat.split('-to-')[1]}`;

        setConvertedFileUrl(url);
        setConvertedFileName(fileName);
      } else {
        console.error('Error converting file:', response.statusText);
      }
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setLoading(false);
    }
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
            {loading && <p className="mt-4 text-blue-600">Converting file, please wait...</p>}
            {convertedFileUrl && (
              <a
                href={convertedFileUrl}
                download={convertedFileName}
                className="mt-4 inline-block px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
              >
                Download Converted File
              </a>
            )}
          </div>
        </main>
      </div>
    </Base>
  );
}