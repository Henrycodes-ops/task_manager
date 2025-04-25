import { useState } from "react";
import axios from "axios";

export default function ConnectionTester() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEndpoint = async (endpoint) => {
    setLoading(true);
    setStatus(`Testing ${endpoint}...`);

    try {
      const response = await axios.get(`http://localhost:3001${endpoint}`, {
        withCredentials: true,
      });
      setResult({
        success: true,
        data: response.data,
      });
      setStatus(`Successfully connected to ${endpoint}`);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        details: error.response?.data || {},
      });
      setStatus(`Failed to connect to ${endpoint}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connection-tester">
      <h2>API Connection Tester</h2>

      <div className="status">Status: {status || "Ready"}</div>

      <div className="buttons">
        <button onClick={() => testEndpoint("/api/status")} disabled={loading}>
          Test API Status
        </button>

        <button
          onClick={() => testEndpoint("/api/debug/config")}
          disabled={loading}
        >
          Test Config
        </button>
      </div>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="troubleshooting">
        <h3>Troubleshooting Tips:</h3>
        <ul>
          <li>Make sure your backend server is running on port 3001</li>
          <li>Check that your environment variables are set correctly</li>
          <li>Verify that CORS is properly configured on the backend</li>
          <li>Check the browser console for any additional errors</li>
        </ul>
      </div>
    </div>
  );
}
