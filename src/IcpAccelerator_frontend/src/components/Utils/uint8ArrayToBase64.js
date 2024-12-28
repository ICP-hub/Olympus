export default function uint8ArrayToBase64(uint8Arr) {
  console.log('uint8Arr', uint8Arr);
  // Ensure the input is not null or undefined
  if (uint8Arr && uint8Arr instanceof Uint8Array) {
    try {
      var rawString = new TextDecoder().decode(uint8Arr);
      console.log('string in userSagea', rawString);
      var canister_id = rawString.split('/')[0];
      var key = rawString.substring(rawString.indexOf('/'));
      console.log(canister_id, key);
      var finalString = '';
      if (process.env.DFX_NETWORK === 'ic') {
        finalString = 'https://' + canister_id + '.icp0.io' + key;
      } else {
        finalString = 'http://' + canister_id + '.localhost:4943' + key;
      }
      console.log('finalString', finalString);
      return finalString;
    } catch (error) {
      console.log('error formatting image', error);
      return null;
    }
  }
  return null;
}
export function base64ToUint8Array(inputString) {
  if (!inputString || typeof inputString !== 'string') {
    console.error('Invalid input string provided:', inputString);
    return new Uint8Array();
  }

  try {
    const isICNetwork = inputString.startsWith('https://');
    let canisterId = '';
    let key = '';

    if (isICNetwork) {
      canisterId = inputString.split('https://')[1].split('.icp0.io')[0];
      key = inputString.split('.icp0.io')[1];
    } else {
      canisterId = inputString.split('http://')[1].split('.localhost:4943')[0];
      key = inputString.split('.localhost:4943')[1];
    }

    const rawString = `${canisterId}${key}`;
    const uint8Arr = new TextEncoder().encode(rawString);
    return uint8Arr;
  } catch (error) {
    console.error('Error processing the input string:', error);
    return new Uint8Array();
  }
}
