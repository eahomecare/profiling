import React from 'react'
import { Modal, Text, Select, Button } from "@mantine/core"; // Import the necessary components from Mantine

const AssignPermissionModal = ({
    isModalOpen,
    handleModalClose,
    selectedUserRoleName,
    selectedUser,
    setSelectedUser,
    permissions,
    selectedPermission,
    setSelectedPermission,
    rolesPermissions,
    handleAssignPermission,
    users,
    selectedRole
}) => {
    return (
        <> <Modal
            opened={isModalOpen}
            onClose={handleModalClose}
            title="Assign permissions"
            size="lg"
            style={{ content: { maxHeight: '80vh' } }}

        >
            <Text fz="xl">Select user below assigning new permission</Text>
            {selectedUserRoleName && <Text> ROLE : {selectedUserRoleName}</Text>}
            <br /><br />
            <Select
                label="Select user"
                placeholder="Pick one"
                data={users.map((user) => ({
                    value: user.id,
                    label: user.agentName || user.email,
                }))}
                value={selectedUser}
                onChange={setSelectedUser}


            />


            {Array.isArray(permissions) && permissions.length > 0 ? (
                <Select
                    label="Select permission"
                    placeholder="Pick one"
                    disabled={selectedRole === null}
                    data={permissions?.map((permission) => ({
                        value: permission.id,
                        label: permission.name,
                        disabled: rolesPermissions.some(rolesPermission => (rolesPermission.permissionId === permission.id && rolesPermission.userId === selectedUser))
                    }))}
                    value={selectedPermission}
                    onChange={setSelectedPermission}
                    dropdownComponent="div"
                />
            ) : (<Text>Loading permissions</Text>)}


            <br />

            <Button
                variant="gradient" gradient={{ from: 'indigo', to: 'red' }}
                className="mt-4"
                onClick={handleAssignPermission}
                disabled={selectedRole === null || selectedPermission === null || selectedRole === null}
            >
                Assign
            </Button>

        </Modal></>
    )
}

export default AssignPermissionModal