export const fetchAvailableConversions = async (extension: string) => {
  try {
    const response = await fetch(`https://localhost:7195/api/Conversion/available-conversions/.${extension}`);
    if (!response.ok) {
      throw new Error('Error fetching conversion formats');
    }
    const data = await response.json();
    return data.endpoints;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const convertFile = async (selectedFormat: string, selectedFile: File) => {
  const formData = new FormData();
  formData.append('inputFile', selectedFile);

  try {
    const response = await fetch(`https://localhost:7195/${selectedFormat}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error converting file');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const contentDisposition = response.headers.get('content-disposition');
    const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `converted-file.${selectedFormat.split('-to-')[1]}`;

    return { url, fileName };
  } catch (error) {
    console.error(error);
    return { url: null, fileName: null };
  }
};