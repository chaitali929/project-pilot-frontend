// src/pages/NewProject.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Topbar from "../components/Topbar"; // ✅ Keep your Topbar

const initialFiles = {
  "src/index.js": `import React from 'react';
function App() {
  return (
    <div>
      Hello World !
    </div>
  );
}
export default App;`,
  "src/styles.css": `body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}`,
  "package.json": `{
  "name": "project-pilot",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "react": "^18.0.0"
  }
}`,
};

const NewProject = () => {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("src/index.js");

  const handleEditorChange = (value) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value,
    }));
  };

  const handleAddFile = () => {
    const fileName = prompt("Enter file name (e.g., src/newFile.js)");
    if (fileName && !files[fileName]) {
      setFiles({
        ...files,
        [fileName]: "// New file created",
      });
      setActiveFile(fileName);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content (No Sidebar) */}
      <div className="flex-1 flex flex-col">
        <Topbar /> {/* ✅ Keep Topbar */}

        <main className="flex-1 flex">
          {/* File Explorer */}
          <aside className="w-64 bg-gray-100 border-r p-4">
            <h2 className="font-semibold mb-2">ProjectPilot</h2>
            <button
              onClick={handleAddFile}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm mb-3"
            >
              + Add File
            </button>
            <ul>
              {Object.keys(files).map((file) => (
                <li
                  key={file}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    file === activeFile ? "bg-blue-200" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  {file}
                </li>
              ))}
            </ul>
          </aside>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* File Tabs */}
            <div className="flex bg-white border-b">
              {Object.keys(files).map((file) => (
                <div
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`px-4 py-2 cursor-pointer border-r ${
                    file === activeFile ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  {file.split("/").pop()}
                </div>
              ))}
            </div>

            {/* Monaco Editor */}
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                activeFile.endsWith(".js")
                  ? "javascript"
                  : activeFile.endsWith(".css")
                  ? "css"
                  : "json"
              }
              value={files[activeFile]}
              onChange={handleEditorChange}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />
          </div>

          {/* Version Control Section */}
          <aside className="w-72 bg-gray-50 border-l p-4">
            <h2 className="font-semibold mb-3">Version Control</h2>
            <input
              type="text"
              placeholder="Edit message"
              className="w-full border rounded p-2 mb-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4">
              Commit changes
            </button>

            <h3 className="font-medium mb-2">History</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ Mayur Kumawat — Added React Components</li>
              <li>✅ Chaitali Dhaje — Updated package.json</li>
              <li>✅ Om Waghmare — Fix styling issues</li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default NewProject;

