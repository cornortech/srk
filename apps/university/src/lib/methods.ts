function base64ToFile(
  base64Data: string,
  fileName: string,
  mimeType: string
): File {
  // Remove the data URL part if it exists (e.g., "data:image/png;base64,")
  const base64String = base64Data.split(",")[1];

  // Convert base64 string to binary data
  const byteCharacters = atob(base64String);

  // Create an array buffer to hold the byte data
  const byteArray = new Uint8Array(byteCharacters.length);

  // Populate the array with the byte data
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  // Create a new File from the byte array
  return new File([byteArray], fileName, { type: mimeType });
}

export const methods = {
  base64ToFile,
};
