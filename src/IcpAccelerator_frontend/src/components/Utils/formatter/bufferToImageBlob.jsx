export const bufferToImageBlob = async (imageBufferArray) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob(imageBufferArray, { type: "image/jpg" });
    const url = URL.createObjectURL(blob);
    resolve(url);
  });
};
