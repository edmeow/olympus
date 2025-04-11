const dowloadBase64AsTxt = (base64String: string, filename: string) => {
  const binaryData = atob(base64String);
  const byteArray = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }
  const link = document.createElement("a");
  link.href = `data:application/octet-stream;base64,${base64String}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default dowloadBase64AsTxt;
