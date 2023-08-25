import React from 'react';

const FileUploader = ({ onFileContent }) => {

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/plain") {
            const fileContent = await file.text();
            onFileContent(fileContent);
        } else {
            alert("Please select a valid .txt file");
        }
    };

    return (
        <div className="mb-15">
            <input type="file" accept=".txt" onChange={handleFileChange} />
        </div>
    );
};

export default FileUploader;