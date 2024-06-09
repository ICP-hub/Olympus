// export function uint8ArrayToBase64(uint8Arr) {
//   const blob = new Blob([uint8Arr]);
//   const url = URL.createObjectURL(blob);
//   return url;
// }

export function uint8ArrayToBase64(uint8Arr) {
  // Ensure the input is not null or undefined
  if (uint8Arr) {
    // Create a Buffer from the entire Uint8Array
    // let buffer = Buffer.from(uint8Arr);
    // // Assuming the content is an image, you can specify the MIME type accordingly
    // const blob = new Blob([buffer], { type: 'image/png' });
    // // Create and return a URL for the blob
    // const url = URL.createObjectURL(blob);
    // return url;

    // console.log('uint8Arr heree', uint8Arr)
    // var string = new TextDecoder().decode(new Uint8Array(uint8Arr));
    // // console.log('string', string)
    // return string
    console.log('uint8ArrayToBase64', uint8Arr)
    try{
      var rawString = new TextDecoder().decode(uint8Arr);
      // console.log('string in userSagea', rawString)
      var canister_id = rawString.split('/')[0]
      var key = rawString.substring(rawString.indexOf('/'))
      // console.log(canister_id, key);
      var finalString = ""
      if (process.env.DFX_NETWORK === "ic"){
        finalString = "https://" + canister_id + ".icp0.io" + key
      }else {
        finalString = "http://" + canister_id + ".localhost:4943" + key
      }
      return finalString
    }
    catch(error){
      console.log('error formatting image', error)
      return null
    }
    
    // console.log('finalString', finalString)

    // const decryptedBlob = new Blob([finalString]);
    // console.log('decryptedBlob', decryptedBlob)
    
    // const url = URL.createObjectURL(decryptedBlob)
    // console.log('url', url)
    
    // return uint8Arr
  }
  return null;
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
