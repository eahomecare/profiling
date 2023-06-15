import { EditableTable } from '../EditableTable/EditableTable';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCustomerServicesHistory } from '../../redux/customerSlice';
import { Loader } from '@mantine/core';

const title = 'Activity';

export function Activity() {
  const { customerDetails, customerServiceHistory } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomerServicesHistory(customerDetails.id));
  }, [customerDetails]);

  const headerData = [
    'Ticket ID',
    'Order ID',
    'Source of Booking',
    'Ticket Type',
    'Ticket Date',
    'Action',
    'TAT',
    'Name',
    'SubType',
  ];

  const createEmptyRow = () => ({
    ticket_id: '',
    order_id: '',
    source_of_booking: '',
    ticket_type: '',
    ticket_date: '',
    action: '',
    tat: '',
    name: '',
    subType: '',
  });

  const initialData = customerServiceHistory.map((historyItem) => ({
    ticket_id: historyItem.ticket_id,
    order_id: historyItem.order_id,
    source_of_booking: historyItem.source_of_booking,
    ticket_type: historyItem.ticket_type,
    ticket_date: historyItem.ticket_date,
    action: historyItem.action,
    tat: historyItem.tat,
    name: historyItem.service.name,
    subType: historyItem.service.subType,
  }));

  return (
    <>
      {Array.isArray(initialData) && initialData.length > 0 ? (
        <EditableTable
          title={title}
          initialData={initialData}
          headerData={headerData}
          createEmptyRow={createEmptyRow}
        />
      ) : (
        <Loader />
      )}
    </>
  );
}
