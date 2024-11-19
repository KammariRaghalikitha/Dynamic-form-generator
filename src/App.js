import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';


const FormContainer = styled.div`
  padding: 20px;
  background-color: ${props => props.darkMode ? '#333' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#000'};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Field = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${props => props.darkMode ? '#555' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#000'};
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${props => props.darkMode ? '#555' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#000'};
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const JSONEditor = ({ schema, setSchema }) => {
  const handleSchemaChange = (e) => {
    try {
      const updatedSchema = JSON.parse(e.target.value);
      setSchema(updatedSchema);  
    } catch (error) {
      console.error("Invalid JSON format", error);
    }
  };

  return (
    <div>
      <h3>Edit the JSON Schema</h3>
      <textarea
        value={JSON.stringify(schema, null, 2)}
        onChange={handleSchemaChange}
        style={{ width: '100%', height: '200px', fontFamily: 'monospace', marginBottom: '20px' }}
      />
    </div>
  );
};

const DynamicForm = ({ schema, setSchema, onSubmit, darkMode }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    
    const filteredData = {};
    schema.fields?.forEach((field) => {
      if (data.hasOwnProperty(field.name)) {
        filteredData[field.name] = data[field.name];
      }
    });
    onSubmit(filteredData);
  };

  const addNewField = () => {
    const newField = {
      name: `newField${schema.fields.length + 1}`,
      label: `New Field ${schema.fields.length + 1}`,
      type: 'text',
      required: false,
    };
    setSchema({
      ...schema,
      fields: [...schema.fields, newField],
    });
  };

  const removeField = (index) => {
    const updatedFields = schema.fields.filter((_, i) => i !== index);
    setSchema({
      ...schema,
      fields: updatedFields,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    alert('Form schema copied to clipboard!');
  };

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'form_submission.json';
    link.click();
  };

  return (
    <FormContainer darkMode={darkMode}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h3>{schema.title}</h3>
        {schema.fields?.map((field, index) => (
          <Field key={index}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
              <Controller
                name={field.name}
                control={control}
                defaultValue=""
                rules={{ required: field.required }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={field.type}
                    id={field.name}
                    darkMode={darkMode}
                    required={field.required}
                  />
                )}
              />
            ) : field.type === 'dropdown' ? (
              <Controller
                name={field.name}
                control={control}
                defaultValue=""
                rules={{ required: field.required }}
                render={({ field }) => (
                  <Select {...field} id={field.name} darkMode={darkMode}>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                )}
              />
            ) : field.type === 'checkbox' ? (
              <Controller
                name={field.name}
                control={control}
                defaultValue={false}
                rules={{ required: field.required }}
                render={({ field }) => (
                  <div>
                    <input type="checkbox" {...field} id={field.name} />
                    <Label htmlFor={field.name}>{field.label}</Label>
                  </div>
                )}
              />
            ) : (
              <p style={{ color: 'red' }}>Unsupported field type: {field.type}</p>
            )}
            {errors[field.name] && <span style={{ color: 'red' }}>This field is required</span>}
            <button type="button" onClick={() => removeField(index)}>Remove Field</button>
          </Field>
        ))}
        <Button type="submit">Submit</Button>
        
      </form>
      <Button onClick={addNewField}>Add New Field</Button>
      <Button onClick={copyToClipboard}>Copy Form JSON</Button>
    </FormContainer>
  );
};

function App() {
  const [schema, setSchema] = useState({
    title: 'User Registration Form',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'age', label: 'Age', type: 'number' },
      { name: 'country', label: 'Country', type: 'dropdown', options: ['India', 'USA', 'UK'] },
    ]
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleFormSubmit = (data) => {
    console.log('Form Data Received:', data);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ width: '45%' }}>
          <JSONEditor schema={schema} setSchema={setSchema} />
        </div>
        <div style={{ width: '45%' }}>
          <DynamicForm schema={schema} setSchema={setSchema} onSubmit={handleFormSubmit} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
