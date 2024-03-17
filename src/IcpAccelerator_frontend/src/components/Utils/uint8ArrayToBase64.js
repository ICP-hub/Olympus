export default function uint8ArrayToBase64(uint8Arr) {
    let buffer = Buffer.from(uint8Arr[0]);
    const decryptedBlob = new Blob([buffer]);
    const url = URL.createObjectURL(decryptedBlob)
    return url
}