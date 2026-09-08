const handleDownload = (input) => {
  const data = input;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.character.name}.json`; // The name of the file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default handleDownload;