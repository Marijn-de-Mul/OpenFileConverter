import React, { useState } from 'react';
import Base from '~/components/base';

export default function Update() {
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const handleUpdate = async () => {
    setUpdating(true);
    setUpdateStatus(null);

    try {
      const response = await fetch('/api/update', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateStatus(data.message);
      } else {
        setUpdateStatus(data.message);
      }
    } catch (error) {
      // setUpdateStatus('An error occurred. Please try again.');
      setUpdateStatus('This feature is not available yet.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Base>
      <div className="flex flex-col items-center justify-center flex-grow">
        <header className="flex flex-col items-center gap-4 mt-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Update OpenFileConverter
          </h1>
          <p className="text-gray-700 dark:text-gray-200">
            Click the button below to run the update script.
          </p>
        </header>
        <main className="flex flex-col items-center justify-center flex-grow w-full">
          <div className="w-full max-w-md p-4 bg-white rounded shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Update Script
            </h2>
            <button
              onClick={handleUpdate}
              className="mt-4 w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Run Update Script'}
            </button>
            {updateStatus && (
              <p className={`mt-4 ${updateStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {updateStatus}
              </p>
            )}
          </div>
        </main>
      </div>
    </Base>
  );
}