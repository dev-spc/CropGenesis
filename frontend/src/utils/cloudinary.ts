
import axios from 'axios';

const uploadImageToCloudinary = async (imageFile) => {

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');
    
    try {
      const response = await axios.post(
        ``,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.secure_url;
    } 
    catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };