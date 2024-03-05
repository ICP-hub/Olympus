import imageCompression from "browser-image-compression";

const CompressedImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1024,
      useWebWorker: false,
    };
    const compressedBlob = await imageCompression(file, options);
    // console.log('compressed blob', compressedBlob)

    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });
    // console.log("Compressed File:", compressedFile);

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export default CompressedImage;

export const blobToVecNat8 = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return Array.from(uint8Array); // Convert Uint8Array to regular array
};
