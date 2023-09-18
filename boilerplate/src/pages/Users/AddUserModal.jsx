import React from 'react';
import { Modal, Text, Select, Button, TextInput, SimpleGrid } from "@mantine/core";

const AddUserModal = ({ isModalOpen, handleModalClose, handleAddUser, userDetails, setUserDetails ,rolesData}) => {
    return (
        <Modal
            opened={isModalOpen}
            onClose={handleModalClose}
            title="Add User"
            style={{ content: { maxHeight: '80vh' } }}
        >
            <SimpleGrid cols={2}>
                <TextInput
                    placeholder="First Name"
                    label="Enter First Name"
                    value={userDetails.firstname}
                    onChange={(event) => setUserDetails({ ...userDetails, firstname: event.target.value })}
                    withAsterisk
                    required
                />

                <TextInput
                    placeholder="Last Name"
                    label="Enter Last Name"
                    value={userDetails.lastname}
                    onChange={(event) => setUserDetails({ ...userDetails, lastname: event.target.value })}
                    withAsterisk
                />

            </SimpleGrid>

            <TextInput
                placeholder="Email"
                label="Enter Email"
                value={userDetails.email}
                onChange={(event) => setUserDetails({ ...userDetails, email: event.target.value })}
                withAsterisk
                required
                type='email'
            />

            <TextInput
                placeholder="Mobile"
                label="Enter Mobile"
                value={userDetails.mobile}
                onChange={(event) => setUserDetails({ ...userDetails, mobile: event.target.value })}
            />

            <Select
                label="Role"
                placeholder="Select Role"
                data={rolesData}
                value={userDetails.role}
                onChange={(value) => setUserDetails({ ...userDetails, role: value })}
                withAsterisk
                required
            />

            <Button
                className="mt-4"
                style={{backgroundColor:!(!userDetails.firstname || !userDetails.lastname || !userDetails.email || !userDetails.role)? "#4E70EA":"grey"}}
                onClick={handleAddUser}
                disabled={!userDetails.firstname || !userDetails.lastname || !userDetails.email || !userDetails.role}
                >
                Add User
            </Button>
        </Modal>
    );
};

export default AddUserModal;
