import { Modal, TextInput } from '@mantine/core';
import React, { useState } from 'react';

const AddKeywordsModal = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);

  function handleSearchChange(e) {
    setSearchValue(e.target.value);
  }

  function handleAddKeyword() {
    setCustomKeywords([...customKeywords, searchValue]);
    setSearchValue('');
  }

  return (
    <Modal
      title="Add Custom Keywords"
      opened={props.opened}
      onClose={props.onClose}
    >
      <TextInput
        label="Search Keywords"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <button onClick={handleAddKeyword}>Add Keyword</button>
      {customKeywords.map((keyword, index) => (
        <div key={index}>{keyword}</div>
      ))}
    </Modal>
  );
};

export default AddKeywordsModal;
