import moment from 'moment'

export function formatDateTime(itemDate, itemTime) {
    const combinedDateTime = `${moment(itemDate).format('YYYY-MM-DD')} ${itemTime}`;
    return moment(combinedDateTime).format('DD-MMM-YYYY | hh:mm A');
}