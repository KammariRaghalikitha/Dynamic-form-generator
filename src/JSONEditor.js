import React, { useState } from 'react';

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function JSONEditor({ schema, setSchema }) {
  const [localSchema, setLocalSchema] = useState(schema);

  const handleSchemaChange = (e) => {
    const newSchema = e.target.value;
    setLocalSchema(newSchema);

    
    debounce(() => {
      setSchema(newSchema);
    }, 300)();
  };

  return (
    <div>
      <h3>JSON Editor</h3>
      <textarea
        value={localSchema}
        onChange={handleSchemaChange}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}

export default JSONEditor;
