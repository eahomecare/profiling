import React, { useState } from 'react';
import {
    Button,
    Col,
    Container,
    Grid,
    Input,
    Modal,
    Paper,
    Text,
    Textarea,
    TextInput,
} from '@mantine/core';
import {
    MultiSelect,
    Flex,
    Badge,
    ActionIcon,
    MultiSelectValueProps,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { default as keyOptions } from '../KeywordsEntry/keywordOptions';

interface CustomerDetailsProps { }

const CustomerDetails: React.FC<CustomerDetailsProps> = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [keywordOptions, setKeywordOptions] = useState<Record<string, string>[]>([...keyOptions]);
    const [keywordsSelected, setKeywordsSelected] = useState<string[]>([]);

    const initialValues = {
        mobileNumber: '',
        name: 'Elon Musk',
        mobileNo: '',
        emailId: 'elonmusk@tesla.com',
        source: 'Homecare',
        city: 'Bangalore',
        remarks: '',
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [mobileNumber, setMobileNumber] = useState('');

    const handleOpenModal = () => {
        if (/^\d{10}$/.test(mobileNumber)) {
            setFormValues({ ...formValues, mobileNumber });
            setModalOpen(true);
        }
    };

    const handleSubmit = () => {
        setModalOpen(false);
        notifications.show({
            title: 'Success',
            message: 'Customer details submitted successfully',
            color: 'success',
            icon: <IconCheck />,
        });
    };

    const handleChange = (change: any) => {
        setKeywordsSelected(change);
    };

    const valueComponent = ({
        label,
        onRemove,
        ...others
    }: MultiSelectValueProps) => {
        const removeButton = (
            <ActionIcon
                onMouseDown={onRemove}
                size="xs"
                color="blue"
                radius="xl"
                variant="transparent"
            >
                <IconX size={14} />
            </ActionIcon>
        );
        return (
            <div {...others}>
                <Badge key={label} size="sm" variant="outline" rightSection={removeButton}>
                    {label}
                </Badge>
            </div>
        );
    };

    const MultiSelectComponent = () => (
        <MultiSelect
            label={
                <Text fz={'sm'} c='dimmed'>{`Keywords (${keywordsSelected.length})`}</Text>
            }
            value={keywordsSelected}
            data={keywordOptions}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={handleChange}
            placeholder={"Enter customer's keywords"}
            clearable
            filter={(value, selected, item) => {
                if (
                    !selected &&
                    item.label?.toLowerCase().startsWith(value.toLowerCase().trim())
                ) {
                    return true;
                } else return false;
            }}
            onCreate={(query) => {
                const item = { value: query, label: query };
                setKeywordOptions((current: any) => [...current, item]);
                return item;
            }}
            styles={{
                input: { minHeight: '100px', backgroundColor: '#FFFFFF00' },
            }}
            valueComponent={valueComponent}
            transitionProps={{
                duration: 150,
                transition: 'pop-top-left',
                timingFunction: 'ease',
            }}
        />
    );
    return (
        <Container>
            <Paper p="md" shadow="xs" style={{ maxWidth: 400, margin: 'auto' }}>
                <TextInput
                    label="Mobile Number"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.currentTarget.value)}
                    required
                    error={!/^\d{10}$/.test(mobileNumber) && 'Please enter a valid mobile number'}
                />

                <Button onClick={handleOpenModal} fullWidth>
                    Submit
                </Button>
            </Paper>

            <Modal
                radius={'md'}
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Customer Details"
            >
                <Grid gutter="md">
                    <Col span={6}>
                        <TextInput
                            label={
                                <Text fz={'sm'} c='dimmed'>Name</Text>
                            }
                            value={formValues.name}
                            disabled
                        />
                    </Col>
                    <Col span={6}>
                        <TextInput
                            label={
                                <Text fz={'sm'} c='dimmed'>Mobile No</Text>
                            }
                            value={formValues.mobileNumber}
                            disabled
                        />
                    </Col>
                    <Col span={6}>
                        <TextInput
                            label={
                                <Text fz={'sm'} c='dimmed'>Email Id</Text>
                            }
                            value={formValues.emailId}
                            disabled
                        />
                    </Col>
                    <Col span={6}>
                        <TextInput
                            label={
                                <Text fz={'sm'} c='dimmed'>Source</Text>
                            }
                            value={formValues.source}
                            disabled
                        />
                    </Col>
                    <Col span={6}>
                        <TextInput
                            label={
                                <Text fz={'sm'} c='dimmed'>City</Text>
                            }
                            value={formValues.city}
                            disabled
                        />
                    </Col>
                    <Col span={12}>
                        <Textarea
                            label={
                                <Text fz={'sm'} c='dimmed'>Remarks</Text>
                            }
                            value={formValues.remarks}
                            onChange={(event) =>
                                setFormValues({ ...formValues, remarks: event.currentTarget.value })
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <MultiSelectComponent />
                    </Col>
                </Grid>

                <Button onClick={handleSubmit} fullWidth style={{ marginTop: '1rem' }}>
                    Submit
                </Button>
            </Modal>
        </Container>
    );
};

export default CustomerDetails;
