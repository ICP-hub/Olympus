export default function uint8ArrayToBase64(uint8Arr) {
    // Ensure the input is not null or undefined
    if (uint8Arr) {
      // Create a Buffer from the entire Uint8Array
      let buffer = Buffer.from(uint8Arr);
      // Assuming the content is an image, you can specify the MIME type accordingly
      const blob = new Blob([buffer], { type: 'image/png' });
      // Create and return a URL for the blob
      const url = URL.createObjectURL(blob);
      return url;
    }
    return null;
  }
  
