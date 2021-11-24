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
      organizationId: 1,
      userId: 1,
      roleId: 2,
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
