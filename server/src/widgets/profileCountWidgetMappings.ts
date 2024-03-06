export const indexName = 'profile-count-widget';

export const mappings = [
  {
    name: 'gender',
    entityPath: 'Personal_Details',
    field: 'gender',
    fieldType: 'string',
    aggregationType: 'direct',
  },
  {
    name: 'age',
    entityPath: 'Personal_Details',
    field: 'date_of_birth',
    fieldType: 'date',
    aggregationType: 'range',
    ranges: [0, 10, 20, 30, 40, 50, 60], // Age groups
  },
  {
    name: 'profiles',
    entityPath:
      'profile_type_customer_mapping -> profile_types',
    field: 'name',
    fieldType: 'string',
    aggregationType: 'direct',
  },
];
