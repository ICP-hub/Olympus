export function uint8ArrayToBase64(uint8Arr) {
  const blob = new Blob([uint8Arr]);
  const url = URL.createObjectURL(blob);
  return url;
}

// export function uint8ArrayToBase64(uint8Arr) {

//   let buffer = Buffer.from(uint8Arr[0]);
//   const decryptedBlob = new Blob([buffer]);
//   const url = URL.createObjectURL(decryptedBlob)
//   return url
// }

export function principalToText(principal) {
  return principal.toText();
}

export function formatDateFromBigInt(bigIntDate) {
  const date = new Date(Number(bigIntDate / 1000000n));
  const dateString = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return dateString;
}

export function numberToDate(bigIntDate) {
  // Convert BigInt to Number before division
  const date = new Date(Number(bigIntDate) / 1000000);
  const dateString = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return dateString;
}
