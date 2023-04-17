import { Button, Card, Center, Container, Flex, RingProgress, Table, Text } from '@mantine/core';


export default function TableDisplay({ customerList }) {
  // const { customer_details } = customerList
  console.log(customerList);
  // const { customerContext, setCustomerContext } = useContext(CustomerContext)
  // const navigate = useNavigate()

  const profileCompletion = (percentage) => {
    return (
      <div>
        <Center>
          <RingProgress
            size={50}
            thickness={5}
            sections={[{ value: percentage, color: (percentage > 75 ? '#1D9B25' : percentage > 60 ? '#CFA400' : '#D85972') }]}
            label={
              <Text color="" weight={20} align="center" size="xs">
                {percentage}%
              </Text>
            }
          />
        </Center>
      </div>
    )
  }

  const rows = customerList.map((customer) => {
    const buttonClick = () => {
      // setCustomerContext(customer)
      // navigate('/dashboard', { state: { customer } })
    }

    return (
      <tr key={customer.id}>
        <td><Flex>{customer.profiling?.personal_details?.full_name}</Flex></td>
        <td><Flex>{'CLID' + customer.id.substr(0, 6) + '....'}</Flex></td>
        <td><Flex>{customer.email}</Flex></td>
        <td><Flex>{customer.source == 1 ? 'Homecare' : customer.source == '01' ? 'Cyberior' : 'Cyberior & Homecare'}</Flex></td>
        <td><Flex>{customer.mobile}</Flex></td>
        <td><Flex>{profileCompletion(customer.profile_completion)}</Flex></td>
        <td>
          <Button
            // color={'#DDE5FF'}
            // variant={'light'}
            variant={'gradient'}
            gradient={{ from: 'indigo', to: 'cyan' }}
            onClick={() => buttonClick()}>
            View
          </Button>
        </td>
      </tr>
    )
  }
  );

  return (
    <Card shadow={'md'}>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th><Flex><Text fw={900} fz={17}>Name</Text></Flex></th>
            <th><Flex><Text fw={900} fz={17}>Customer Id</Text></Flex></th>
            <th><Flex><Text fw={900} fz={17}>Email</Text></Flex></th>
            <th><Flex><Text fw={900} fz={17}>Source</Text></Flex></th>
            <th><Flex><Text fw={900} fz={17}>Mobile</Text></Flex></th>
            <th><Flex><Text fw={900} fz={17}>Profile Completion</Text></Flex></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  );
}