import axios from 'axios';

export const deleteFile = async (filename: string) => {
  console.log('Deleting file:', filename);
  try {
    const response = await axios.delete('/api/delete-file', {
      params: { filename: filename },
    });

    console.log(response.data.message);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Delete failed:',
        error.response?.data?.error || error.message
      );
    } else {
      console.error('Unknown error:', error);
    }
  }
};
