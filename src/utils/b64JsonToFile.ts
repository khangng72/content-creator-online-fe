export function b64JsonToFile(b64: string, fileName: string): File {
  const byteString = atob(b64); // decode base64
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ia], fileName, { type: 'image/png' });
}
