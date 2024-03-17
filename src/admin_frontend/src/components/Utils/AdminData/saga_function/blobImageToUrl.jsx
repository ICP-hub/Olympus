
export function uint8ArrayToBase64(uint8Arr) {
    let buffer = Buffer.from(uint8Arr);
    const decryptedBlob = new Blob([buffer]);
    const url = URL.createObjectURL(decryptedBlob);
    return url;
  }



export function principalToText(principal){
    return principal.toText()
  }
  

  export function formatDateFromBigInt(bigIntDate) {
     const date = new Date(Number(bigIntDate / 1000000n));
     const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
     const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
     return `${dateString} at ${timeString}`;
  }