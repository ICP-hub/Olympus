export default function uint8ArrayToBase64(uint8Arr) {
  // Ensure the input is not null or undefined
  if (uint8Arr && uint8Arr instanceof Uint8Array) {
    try {
      var rawString = new TextDecoder().decode(uint8Arr);
      // console.log('string in userSagea', rawString)
      var canister_id = rawString.split('/')[0];
      var key = rawString.substring(rawString.indexOf('/'));
      // console.log(canister_id, key);
      var finalString = '';
      if (process.env.DFX_NETWORK === 'ic') {
        finalString = 'https://' + canister_id + '.icp0.io' + key;
      } else {
        finalString = 'http://' + canister_id + '.localhost:4943' + key;
      }
      return finalString;
    } catch (error) {
      console.log('error formatting image', error);
      return null;
    }
  }
  return null;
}
