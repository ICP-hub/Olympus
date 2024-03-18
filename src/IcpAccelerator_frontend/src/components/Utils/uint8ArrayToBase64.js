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
  


  export function formatDateFromBigInt(bigIntDate) {
    const milliseconds = Number(bigIntDate) / 1000000; 
    const date = new Date(milliseconds);
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

