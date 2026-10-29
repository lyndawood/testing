import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3000;

// Root HTML page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MongoDB Diagnostic Fixture</title>
    <style>
        :root {
            --bg: #ffffff;
            --text: #1a1a1a;
            --border: #e0e0e0;
            --error-bg: #fff5f5;
            --error-border: #feb2b2;
            --error-text: #c53030;
            --code-bg: #f7fafc;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #1a1a1a;
                --text: #e0e0e0;
                --border: #404040;
                --error-bg: #2d1a1a;
                --error-border: #9b2c2c;
                --error-text: #fc8181;
                --code-bg: #2d3748;
            }
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding: 2rem 1rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            margin-bottom: 1rem;
            font-weight: 700;
        }
        p {
            margin-bottom: 1.5rem;
            max-width: 65ch;
        }
        .diagnostic-section {
            margin-top: 2rem;
            padding: 1.5rem;
            border: 2px solid var(--border);
            border-radius: 8px;
        }
        h2 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        button {
            background: #3182ce;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
        }
        button:hover {
            background: #2c5aa0;
        }
        button:focus {
            outline: 2px solid #3182ce;
            outline-offset: 2px;
        }
        button:disabled {
            background: #a0aec0;
            cursor: not-allowed;
        }
        #result {
            margin-top: 1.5rem;
        }
        .error {
            background: var(--error-bg);
            border: 2px solid var(--error-border);
            color: var(--error-text);
            padding: 1rem;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .loading {
            color: var(--text);
            font-style: italic;
        }
        code {
            background: var(--code-bg);
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.875em;
        }
        ul {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }
        li {
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MongoDB Connection Diagnostic</h1>
        <p>This fixture intentionally attempts to connect to MongoDB at <code>mongodb://127.0.0.1:27017</code> to demonstrate that Forge's sandbox can run Express servers but has no MongoDB access.</p>
        
        <div class="diagnostic-section">
            <h2>Expected Behavior</h2>
            <ul>
                <li>Express server starts successfully on port ${PORT}</li>
                <li>MongoDB connection attempt fails with <code>ECONNREFUSED</code></li>
                <li>API returns HTTP 503 with full error details</li>
                <li>Error is logged to server console</li>
            </ul>
            
            <button id="testBtn" onclick="testConnection()">Test MongoDB Connection</button>
            <div id="result"></div>
        </div>
    </div>

    <script>
        async function testConnection() {
            const btn = document.getElementById('testBtn');
            const result = document.getElementById('result');
            
            btn.disabled = true;
            result.innerHTML = '<div class="loading">Attempting MongoDB connection...</div>';
            
            try {
                const response = await fetch('/api/items');
                const data = await response.json();
                
                if (!response.ok) {
                    result.innerHTML = \`<div class="error"><strong>HTTP \${response.status} - Connection Failed (Expected)</strong>\\n\\n\${data.error}\\n\\nDetails:\\n\${JSON.stringify(data.details, null, 2)}</div>\`;
                } else {
                    result.innerHTML = \`<div class="error">Unexpected success: \${JSON.stringify(data, null, 2)}</div>\`;
                }
            } catch (err) {
                result.innerHTML = \`<div class="error">Fetch error: \${err.message}</div>\`;
            } finally {
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>`);
});

// API endpoint that attempts MongoDB connection
app.get('/api/items', async (req, res) => {
  const mongoUrl = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(mongoUrl, {
    serverSelectionTimeoutMS: 2000,
  });

  try {
    console.log('Attempting MongoDB connection to:', mongoUrl);
    await client.connect();
    
    // If we somehow connect, return data
    const db = client.db('test');
    const items = await db.collection('items').find({}).toArray();
    res.json({ items });
  } catch (error) {
    // Log the full error to server console
    console.error('MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // Extract relevant error details
    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
      errno: error.errno,
    };
    
    // Return 503 with error details
    res.status(503).json({
      error: `MongoDB connection failed: ${error.message}`,
      details: errorDetails,
      attemptedUrl: mongoUrl,
      timestamp: new Date().toISOString(),
    });
  } finally {
    await client.close().catch(() => {});
  }
});

// Start server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server listening on http://0.0.0.0:${PORT}`);
  console.log('This diagnostic fixture will attempt MongoDB connection and intentionally fail.');
});
