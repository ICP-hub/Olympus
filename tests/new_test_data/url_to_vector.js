var args = process.argv.slice(2);
const arrayBufferView = new TextEncoder().encode(args[0]);
// console.log(resEncodedMessage)
var image = "{";
for (let i = 0; i < arrayBufferView.length; i++) {
  image = image + arrayBufferView[i].toString() + ";";
}
image = image + "}";
console.log(image);
