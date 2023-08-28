import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconLoader } from '@tabler/icons-react'; // Assuming that @tabler/icons-react has a loader icon

const showNotification = (type, title, message) => {
    switch (type) {
        case 'success':
            return notifications.show({
                title,
                message,
                color: 'teal',
                icon: <IconCheck size="1rem" />,
                autoClose: 5000,
            });

        case 'error':
            return notifications.show({
                title,
                message,
                color: 'red',
                icon: <IconX size="1rem" />,
                autoClose: 5000,
            });

        case 'loading':
            return notifications.show({
                title,
                message,
                loading: true,
                autoClose: false,
            });

        default:
            return notifications.show({
                title,
                message,
                autoClose: 5000,
            });
    }
};

export const updateLoading = (notificationId, title, message) => {
    notifications.update({
        id: notificationId,
        color: 'teal',
        title,
        message,
        icon: <IconCheck size="1rem" />,
        autoClose: 5000,
    });
};

export const showSuccess = (title, message) => showNotification('success', title, message);
export const showError = (title, message) => showNotification('error', title, message);
export const showLoading = (title, message) => showNotification('loading', title, message);
