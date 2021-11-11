const OrganizationService = {
  getOrganizationById: () =>
    Promise.resolve({
      id: 1,
      name: 'testOrg',
      owner: {
        id: 1,
        username: 'testUser',
      },
    }),
  createOrganization: (name: string) =>
    Promise.resolve({
      id: 1,
      name,
      owner: {
        id: 1,
        username: 'testUser',
      },
    }),
  inviteUser: () =>
    Promise.resolve({
      organization_id: 1,
      user_id: 1,
      role_id: 2,
    }),
  deleteOrganization: () => Promise.resolve(''),
  getCurrentUserOrganizations: () =>
    Promise.resolve([
      {
        id: 1,
        name: 'testOrg',
        owner: {
          id: 1,
          username: 'testUser',
        },
      },
    ]),
};

export default OrganizationService;
