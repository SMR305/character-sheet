import React, { useState } from "react";

const FileUploader = ({ onSubmit }) => {
  const [jsonData, setJsonData] = useState(null); // State to store JSON data
  const [error, setError] = useState(""); // State to handle errors
  const [selectedFile, setSelectedFile] = useState(null); // State to track selected file

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result); // Parse the JSON content
          setJsonData(data); // Save the JSON data in state
          setError(""); // Clear any existing errors
        } catch (err) {
          setJsonData(null);
          setError("Invalid JSON file. Please upload a valid JSON."); // Handle JSON parsing errors
        }
      };

      reader.readAsText(file); // Read the file as text
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      // console.log("Uploaded JSON data:", jsonData); // Log the parsed JSON data
      onSubmit(jsonData);
      alert(`File "${selectedFile.name}" has been uploaded and parsed!`);
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".json" // Restrict file types to JSON
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {jsonData && (
          <div>
            <h4>Extracted Character Details:</h4>
            <div>
              <strong>Name:</strong> {jsonData.character.name} <br />
              <strong>Race:</strong> {jsonData.character.race} <br />
              <strong>Background:</strong> {jsonData.character.background} <br />
              <strong>Alignment:</strong> {jsonData.character.alignment}
              {jsonData.levels.map((level, index) => (
                <div>
                  <strong>{level.className}:</strong> {level.level} <br />
                </div>
              ))}
            </div>
          </div>
        )}
        <br />
        <button className={'button'} type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUploader;