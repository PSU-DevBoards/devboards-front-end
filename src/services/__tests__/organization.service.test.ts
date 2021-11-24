import organizationService from '../organization.service';

describe('organizationService', () => {
  it('gets organization by id', async () => {
    const org = { id: 1, name: 'testOrg', owner: { id: 1, username: 'test' } };
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(org),
      } as any)
    );

    const searchOrg = await organizationService.getOrganizationById(1);

    expect(searchOrg).toEqual(org);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1'),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });

  it('gets the current user organizations', async () => {
    const org = [
      { id: 1, name: 'testOrg', owner: { id: 1, username: 'test' } },
    ];
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(org),
      } as any)
    );

    const currentUserOrgs =
      await organizationService.getCurrentUserOrganizations();

    expect(currentUserOrgs).toEqual(org);
    expect(global.fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  it('gets organization user by id', async () => {
    const organizationUsers = [
      { organizationId: 1, userId: 1, roleId: null },
    ];
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(organizationUsers),
      } as any)
    );

    const returnedOrganizationUsers =
      await organizationService.getOrganizationUsers(1);

    expect(returnedOrganizationUsers).toEqual(organizationUsers);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1/users'),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });

  it('create organization', async () => {
    const name = 'testOrg';
    const organization = {
      id: 0,
      name,
      owner: { id: 0, username: 'testUser' },
    };
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(organization),
      } as any)
    );

    const newOrganization = await organizationService.createOrganization(name);

    expect(newOrganization).toEqual(organization);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })
    );
  });

  it('updates an organization by id', async () => {
    const name = 'testOrg';
    const organization = {
      id: 0,
      name,
      owner: { id: 0, username: 'testUser' },
    };
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(organization),
      } as any)
    );

    const newOrganization = await organizationService.updateOrganization(1, {
      name,
    });

    expect(newOrganization).toEqual(organization);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1'),
      expect.objectContaining({
        method: 'PATCH',
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })
    );
  });

  test('deletes an organization by id', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { 'Content-Type': 'application/json' },
        text: () => Promise.resolve(''),
      } as any)
    );

    organizationService.deleteOrganization(1);

    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1'),
      expect.objectContaining({
        method: 'DELETE',
        headers: {
          Authorization: expect.any(String),
        },
      })
    );
  });

  test('invites a user by email', () => {
    organizationService.inviteUser(1, 'test@test.com', 1);

    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1/users'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          roleId: 1,
        }),
      })
    );
  });

  test('gets the current users organizations', () => {
    organizationService.getCurrentUserJoinedOrganizations();

    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/users/me/organizations/joined'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});
