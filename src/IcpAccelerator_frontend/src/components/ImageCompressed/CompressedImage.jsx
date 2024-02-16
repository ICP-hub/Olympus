import imageCompression from "browser-image-compression";

const CompressedImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1024,
      useWebWorker: false,
    };
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });
    console.log("Compressed File:", compressedFile);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export default CompressedImage;
