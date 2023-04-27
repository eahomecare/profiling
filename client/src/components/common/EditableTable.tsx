import { useState } from 'react';
import {
    createStyles,
    Table,
    Checkbox,
    ScrollArea,
    TextInput,
    Button,
    Box,
    Text,
    rem,
    Group,
    ActionIcon,
} from '@mantine/core';
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface EditableTableProps<T> {
    title: string;
    initialData: T[];
    headerData: string[];
    createEmptyRow: () => T
}

export function EditableTable<T extends Record<string, any>>({ title, initialData, headerData, createEmptyRow }: EditableTableProps<T>) {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState<string[]>([]);
    const [data, setData] = useState(initialData);
    const [editRow, setEditRow] = useState<string | null>(null);
    const [newRow, setNewRow] = useState<Partial<T> | null>(null);
    const [showEditColumn, setShowEditColumn] = useState(false);
    const [tempEditData, setTempEditData] = useState<Partial<T> | null>(null);


    const headerElements = headerData.map((headerItem: string, index: number) => (
        <th key={index}>{headerItem}</th>
    ));

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === data.length ? [] : data.map((item) => item.id),
        );

    const handleEditChange = (
        rowId: string,
        key: keyof T,
        value: string,
    ) => {
        setTempEditData((prevData) =>
            prevData && prevData.id === rowId
                ? { ...prevData, [key]: value }
                : prevData,
        );
    };

    const handleDelete = () => {
        setData((prevData) => prevData.filter((item) => !selection.includes(item.id)));
        setSelection([]);
    };

    const handleNewRowChange = (key: keyof T, value: string) => {
        if (newRow) {
            setNewRow({ ...newRow, [key]: value });
        }
    };

    const handleEditSave = (rowId: string) => {
        setData((prevData) =>
            prevData.map((item: T) =>
                item.id === rowId ? { ...item, ...tempEditData } : item,
            ),
        );
        setEditRow(null);
        setTempEditData(null);
    };

    const handleDiscard = (rowId: string) => {
        setEditRow(null);
        setTempEditData(null);
    };

    const handleSaveNewRow = () => {
        if (newRow) {
            setData((prevData) => [
                ...prevData,
                {
                    ...createEmptyRow(),
                    ...newRow,
                    id: (data.length + 1).toString(),
                },
            ]);
            setNewRow(null);
        }
    };

    const handleEdit = (rowId: string) => {
        setTempEditData(data.find((item) => item.id === rowId) || null);
        setEditRow((prevState) => (prevState === rowId ? null : rowId));
    };

    const handleAdd = () => {
        if (showEditColumn) {
            setShowEditColumn(false);
        }
        if (newRow) {
            setNewRow(null);
        } else {
            setNewRow(createEmptyRow());
        }
    };

    const handleToggleEditColumn = () => {
        if (newRow) {
            setNewRow(null);
        }
        setShowEditColumn(!showEditColumn);
    };

    const newRowElement = newRow ? (
        <tr >
            {Object.keys(newRow).map((key) => (
                <td key={key}>
                    <TextInput
                        value={newRow[key as keyof T] || ''}
                        onChange={(event) => handleNewRowChange(key as keyof T, event.currentTarget.value)}
                    />
                </td>
            ))}
            <td>
                <Button onClick={handleSaveNewRow} bg={'#4E70EA'}>Save</Button>
            </td>
        </tr>
    ) : null;

    const rows = data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <td>
                    <Checkbox
                        checked={selection.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                        transitionDuration={0}
                    />
                </td>
                {Object.keys(item)
                    .filter(item => item != 'id')
                    .map((key) =>
                        editRow === item.id ? (
                            <td key={key}>
                                <TextInput
                                    value={tempEditData && tempEditData[key as keyof T] || ''}
                                    onChange={(event) =>
                                        handleEditChange(item.id, key as keyof T, event.currentTarget.value)}
                                />
                            </td>
                        ) : (
                            <td key={key}>{item[key as keyof T]}</td>
                        ),
                    )}
                {showEditColumn && (
                    <td>
                        {editRow === item.id ? (
                            <>
                                <ActionIcon onClick={() => handleEditSave(item.id)} color='green' variant='subtle' size={'sm'}>
                                    <IconCheck />
                                </ActionIcon>
                                <ActionIcon onClick={() => handleDiscard(item.id)} color='red' variant='subtle' size={'sm'}>
                                    <IconX />
                                </ActionIcon>
                            </>
                        ) : (
                            <ActionIcon onClick={() => handleEdit(item.id)} color='blue' variant='subtle' size={'sm'}>
                                <IconEdit color='#4E70EA' />
                            </ActionIcon>
                        )}
                    </td>
                )}
            </tr>
        );
    });

    return (
        <>
            <Group position='apart'>
                <Box mb={5}>
                    <Text fw={700}>{title || ''}</Text>
                </Box>
                <Box mb={5}>
                    <Group>
                        <Group onClick={handleDelete} style={{ cursor: 'pointer' }} >
                            <ActionIcon color='red' variant='subtle' size={'sm'}>
                                <IconTrash />
                            </ActionIcon>
                            <Text ml={-18} color='red' size={'sm'}>Delete</Text>
                        </Group>
                        <Group onClick={handleToggleEditColumn} style={{ cursor: 'pointer' }}>
                            <ActionIcon variant='subtle' size={'sm'}>
                                <IconEdit color='#4E70EA' />
                            </ActionIcon>
                            <Text ml={-18} color='#4E70EA' size={'sm'}>Edit</Text>
                        </Group>
                        <Group onClick={handleAdd} style={{ cursor: 'pointer' }}>
                            <ActionIcon color='blue' variant='subtle' size={'sm'}>
                                <IconPlus color='#4E70EA' />
                            </ActionIcon>
                            <Text ml={-18} color='#4E70EA' size={'sm'}>Add More</Text>
                        </Group>
                    </Group>
                </Box>
            </Group>
            <ScrollArea>
                <Table miw={800} verticalSpacing="sm">
                    <thead>
                        <tr>
                            <th style={{ width: rem(40) }}>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={selection.length === data.length}
                                    indeterminate={selection.length > 0 && selection.length !== data.length}
                                    transitionDuration={0}
                                />
                            </th>
                            {headerElements}
                            {showEditColumn && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                        {newRowElement}
                    </tbody>
                </Table>
            </ScrollArea>
        </>
    );
}