const stub = {
    getOrganizationById: () =>
      Promise.resolve({
        id: 1,
        name: 'testOrg',
        owner: {
          id: 1,
          username: 'testUser'
        },
      }),

    getOrganizationUsers: () =>
      Promise.resolve([{
        organization_id: 1,
        user_id: 1,
        role_id: null,
      }]),
  };
  
  export default stub;  