import { useState } from 'react';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // GET request example
  const fetchMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/message');
      const data = await response.json();
      setBackendData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBackendData({ message: "Failed to connect to backend" });
    }
    setIsLoading(false);
  };

  // POST request example
  const sendToBackend = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputText })
      });
      const data = await response.json();
      setBackendData(data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>Full-Stack Demo</h1>
      
      <div className="card">
        <h2>GET Request Demo</h2>
        <button onClick={fetchMessage} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Backend Message'}
        </button>
      </div>

      <div className="card">
        <h2>POST Request Demo</h2>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something..."
        />
        <button onClick={sendToBackend} disabled={isLoading || !inputText.trim()}>
          {isLoading ? 'Sending...' : 'Send to Backend'}
        </button>
      </div>

      {backendData && (
        <div className="response">
          <h3>Backend Response:</h3>
          <pre>{JSON.stringify(backendData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;