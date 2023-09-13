import React from 'react'
import { Modal, Text, Select, Button, TextInput } from "@mantine/core"; // Import the necessary components from Mantine

const CreatePermissionModal = ({ isModalOpen, handleModalClose, handleCreatePermission, permissionName, setPermissionName }) => {
    return (
        <> <Modal
            opened={isModalOpen}
            onClose={handleModalClose}
            title="Create permissions"
            style={{ content: { maxHeight: '80vh' } }}

        >
            <TextInput
                placeholder="Permssion name"
                label="Enter Permission name"
                value={permissionName}
                onChange={(event) => setPermissionName(event.target.value)}
                withAsterisk
            />

            <Button
                className="mt-4"
                onClick={handleCreatePermission} >
                Create
            </Button>

        </Modal></>
    )
}

export default CreatePermissionModal