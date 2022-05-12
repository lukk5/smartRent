export const DownloadFile = (file: string, fileName: string) => 
{
    const byteCharacters = atob(file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "pdf" });

    const url = window.URL.createObjectURL(blob);
    const tempElement = document.createElement("a");
    tempElement.href = url;
    tempElement.setAttribute("download", fileName);

    document.body.appendChild(tempElement);

    tempElement.click();
    tempElement.parentNode?.removeChild(tempElement);
}