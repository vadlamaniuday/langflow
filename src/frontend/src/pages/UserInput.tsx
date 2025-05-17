import { useState } from "react";

export default function UserInputPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7860/api/userinput/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.response || data.error);
    } catch (err) {
      setResponse("Error contacting backend");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-semibold mb-4 text-center">💬 Ask the AI</h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message here..."
        />
        <button
          className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Submit"}
        </button>

        {response && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <strong className="text-gray-700">Response:</strong>
            <p className="mt-2 whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
