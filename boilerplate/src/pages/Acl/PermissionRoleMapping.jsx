import React, { useState } from 'react';
import { ScrollArea, Table } from '@mantine/core';

const PermissionRoleMappings = ({ useStyles, initialData }) => {

    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);

    const rows = initialData.map((row) => (
        <tr key={row.id}>
            <td>{row.rolename}</td>
            <td>{row.permissionname}</td>
            <td>{row.username}</td>
            <td>{row.isactive}</td>
            <td>{row.created_at}</td>
        </tr>
    ));

    return (
        <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table miw={700}>
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <tr>
                        <th>Role Name</th>
                        <th>Permission Name</th>
                        <th>User Email</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}

export default PermissionRoleMappings;
