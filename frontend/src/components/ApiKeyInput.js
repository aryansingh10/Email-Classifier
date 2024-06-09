// ApiKeyInput.js
import React, { useState } from 'react';

const ApiKeyInput = ({ onSave }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('openaiApiKey') || '');

    const handleSaveApiKey = () => {
        localStorage.setItem('openaiApiKey', apiKey);
        onSave(apiKey);
        alert('API Key saved!');
    };

    return (
        <div>
            <label>
                Enter your OpenAI API key:
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </label>
            <button onClick={handleSaveApiKey}>Save API Key</button>
        </div>
    );
};

export default ApiKeyInput;
