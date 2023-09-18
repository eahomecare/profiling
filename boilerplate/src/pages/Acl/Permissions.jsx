import React, { useState } from 'react';
import { ScrollArea, Table, Title, Button } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

const Permissions = ({ useStyles, initialData, title }) => {

    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);

    const rows = initialData.map((row) => (
        <tr key={row.id}>
            <td>{row.name}</td>
            <td><Button color='teal' size="xs" compact>{row.isactive}</Button></td>
            <td>{row.created_at}</td>
            <td><ActionIcon variant="light"><IconSettings size="1rem" /></ActionIcon></td>
        </tr>
    ));

    return (
        <>
            <Title style={{ padding: "10px" }} order={4} color="blue.5">{title}</Title>

            <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table miw={700} striped withBorder highlightOnHover withColumnBorders>
                    <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </>

    );
}

export default Permissions;
