export default function uint8ArrayToBase64(uint8Arr) {
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
      // console.log('finalString', finalString)

      // const decryptedBlob = new Blob([finalString]);
      // console.log('decryptedBlob', decryptedBlob)
      
      // const url = URL.createObjectURL(decryptedBlob)
      // console.log('url', url)
      return finalString
      // return uint8Arr
    }
    return null;
  }
  
