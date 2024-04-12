import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 0.6, // Maximum file size you want after compression
      maxWidthOrHeight: 1024, // Maximum size of the width or height of the image
      useWebWorker: true, // Utilize Web Worker for performance improvement
    };
    const compressedBlob = await imageCompression(file, options);
    console.log('Compressed blob:', compressedBlob); // Debugging line, can be commented out

    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });
    console.log("Compressed File:", compressedFile); // Debugging line, can be commented out

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export default compressImage;

export const blobToVecNat8 = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return Array.from(uint8Array); // Convert Uint8Array to regular array
};
