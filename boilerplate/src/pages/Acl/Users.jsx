import React, { useState } from 'react';
import { ScrollArea, Table } from '@mantine/core';

const Users = ({ useStyles, initialData }) => {

    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);

    const rows = initialData.map((row) => (
        <tr key={row.id}>
            <td>{row.email}</td>
            <td>{row.role}</td>
            <td>{row.permissions}</td>
            <td>{row.isactive}</td>
            <td>{row.created_at}</td>
        </tr>
    ));

    return (
        <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table miw={700}>
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Permissions</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}

export default Users;
