import { EditableTable } from '../common/EditableTable';

const title = 'Social Media Details'

interface TableSelectionProps {
    id: string;
    handle: string;
    platform: string;
}

const initialData: TableSelectionProps[] = [
    {
        id: '1',
        handle: '@userName',
        platform: 'Facebook',
    },
    {
        id: '2',
        handle: '@userName',
        platform: 'Instagram',
    },
    {
        id: '3',
        handle: '@userName',
        platform: 'Twitter',
    },
];

const headerData = ['Handle', 'Platform'];

const createEmptyRow = (): TableSelectionProps => ({
    id: '',
    handle: '',
    platform: '',
});

export function SocialMediaDetails() {
    return <EditableTable<TableSelectionProps> title={title} initialData={initialData} headerData={headerData} createEmptyRow={createEmptyRow} />;
}