import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const FormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
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
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

function DynamicForm({ schema }) {
  const { register, handleSubmit } = useForm();

  let parsedSchema;

  
  try {
    parsedSchema = JSON.parse(schema);

    if (!Array.isArray(parsedSchema.fields)) {
      throw new Error('Invalid schema: "fields" must be an array.');
    }

   
    parsedSchema.fields = parsedSchema.fields.filter(
      (field) => field.type && field.name && field.name.trim() !== ""
    );

    if (parsedSchema.fields.length === 0) {
      throw new Error('No valid fields to render. Ensure all fields have "type" and "name".');
    }
  } catch (error) {
    return <p style={{ color: 'red' }}>{error.message}</p>;
  }


  const onSubmit = (data) => {
    
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value && key.trim() !== "")
    );

   
    fetch('http://localhost:5000/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Form data sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error submitting form data:', error);
      });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>{parsedSchema.title}</h3>
        {parsedSchema.fields.map((field, index) => (
          <Field key={index}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
              <Input
                type={field.type}
                id={field.name}
                {...register(field.name, { required: field.required, min: field.min, max: field.max })}
              />
            ) : field.type === 'checkbox' ? (
              <Input type="checkbox" id={field.name} {...register(field.name)} />
            ) : field.type === 'dropdown' ? (
              <Select id={field.name} {...register(field.name)}>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <p style={{ color: 'red' }}>Unsupported field type: {field.type}</p>
            )}
          </Field>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
}

export default DynamicForm;
