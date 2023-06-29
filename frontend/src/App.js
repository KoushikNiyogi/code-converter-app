import './App.css';
import React, { useState } from 'react';
import axios from "axios"
function App() {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [debuggedCode, setDebuggedCode] = useState('');
  const [qualityResults, setQualityResults] = useState([]);
  const [error, setError] = useState('');

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleConvertClick = async () => {
    setConvertedCode("");
    setQualityResults([]);
    try {
      const response = await axios.post('https://code-converter-backend-server.onrender.com/convert', { code, language: selectedLanguage });
      console.log(response.data);
      setConvertedCode(response.data.convertedCode);
      setError('');
    } catch (error) {
      setConvertedCode('');
      setError('An error occurred while converting the code.');
    }
  };

  const handleDebugClick = async () => {
    setConvertedCode("");
    setQualityResults([]);
    try {
      const response = await axios.post('https://code-converter-backend-server.onrender.com/debug', { code });
      console.log(response)
      setDebuggedCode(response.data.correctedCode);
      setError('');
    } catch (error) {
      setDebuggedCode('');
      setError('An error occurred while debugging the code.');
    }
  };


  
  const handleQualityCheckClick = async () => {
    setConvertedCode("");
    setDebuggedCode("");
    try {
      const response = await axios.post('https://code-converter-backend-server.onrender.com/quality', { code });
      console.log(response);
      setQualityResults(response.data);
      setError('');
    } catch (error) {
      setQualityResults([]);
      setError('An error occurred while checking the code quality.');
    }
  };

  return (
    <div className="app">
      <h1>Code Converter App</h1>

      <div className="top">
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">Select Language</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          {/* Add more programming languages as needed */}
        </select>
        <button onClick={handleConvertClick}>Convert</button>
        <button onClick={handleDebugClick}>Debug</button>
        <button onClick={handleQualityCheckClick}>Quality Check</button>
      </div>
      <div className="bottom">
        <div className="left">
          <textarea
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter your code here"
            rows={10}
            cols={50}
          />
        </div>
        <div className="right">
          {selectedLanguage && convertedCode && (
            <div>
              <h2>Output</h2>
              <div>{
                convertedCode.split("\n").map((el)=><p>{el}</p>)
                }</div>
            </div>
          )}
          {debuggedCode && (
            <div>
              <h2>Output</h2>
              <pre>{debuggedCode.split("\n").map((el)=><p>{el}</p>)}</pre>
            </div>
          )}
          {qualityResults.length > 0 && (
            <div>
              <h2>Output</h2>
              <ul>
                {qualityResults.map((result, index) => (
                  <li key={index}>
                    <strong>{result.parameter}</strong>: <span>{result.suggestions}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;

