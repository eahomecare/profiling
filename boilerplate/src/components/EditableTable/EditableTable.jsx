import React, { useState } from 'react';
import { Table, Button, TextInput, Text } from '@mantine/core';

function ExampleTable() {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newData, setNewData] = useState({ name: '', age: '', email: '' });

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index) => {
    setData((prevData) =>
      prevData.map((item, i) => (i === index ? newData : item))
    );
    setEditingIndex(null);
    setNewData({ name: '', age: '', email: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.currentTarget;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddNew = () => {
    setData((prevData) => [...prevData, newData]);
    setNewData({ name: '', age: '', email: '' });
  };

  return (
    <>
      <Table
        data={data}
        columns={[
          { label: 'Name', dataKey: 'name' },
          { label: 'Age', dataKey: 'age' },
          { label: 'Email', dataKey: 'email' },
          {
            label: 'Actions',
            align: 'right',
            render: (_, index) =>
              editingIndex === index ? (
                <>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleSave(index)}
                    style={{ marginRight: 10 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </Button>
              ),
          },
        ]}
      />
      <div style={{ display: 'flex', marginTop: 20 }}>
        <TextInput
          label="Name"
          name="name"
          value={newData.name}
          onChange={handleInputChange}
          style={{ marginRight: 10 }}
        />
        <TextInput
          label="Age"
          name="age"
          value={newData.age}
          onChange={handleInputChange}
          style={{ marginRight: 10 }}
        />
        <TextInput
          label="Email"
          name="email"
          value={newData.email}
          onChange={handleInputChange}
          style={{ marginRight: 10 }}
        />
        <Button variant="primary" onClick={handleAddNew}>
          Add New
        </Button>
      </div>
    </>
  );
}

export default ExampleTable;
