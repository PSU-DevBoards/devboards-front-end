const stub = {
  getCurrentUser: () =>
    Promise.resolve({
      id: 1,
      username: 'testUser',
    }),

  getCurrentUserOrganizations: () =>
    Promise.resolve([{
      id: 1,
      name: 'testOrg',
      owner: {
        id: 1,
        username: 'testUser'
      },
    }]),
};

export default stub;
