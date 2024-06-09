import React from 'react';

const EmailList = ({ emails }) => {
  const extractNameFromHeader = (headers) => {
    const fromHeader = headers.find(header => header.name === 'From');
    if (fromHeader) {
      const match = fromHeader.value.match(/(.+)<(.+)>/);
      if (match && match.length === 3) {
        return match[1].trim();
      } else {
        return fromHeader.value;
      }
    }
    return 'Unknown';
  };

  return (
    <div className="email-list">
      {emails.map((email, index) => (
        <div key={index} className="email-item" style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '5px', marginBottom: '10px' }}>
          <h3>Email ID: {email.id}</h3>
          <h3>Email Name: {extractNameFromHeader(email.payload.headers)}</h3>
          <p>Snippet: {email.snippet}</p>
          <p>Label IDs: {email.labelIds.includes('CATEGORY_PROMOTIONS') ? 'Promotional' : 'Other'}</p>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
