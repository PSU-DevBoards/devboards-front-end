import organizationService from '../organization.service';

describe('organizationService', () => {
  it('gets organization by id', async () => {
    const org = { id: 1, name: 'testOrg', owner: { id: 1, username: 'test' } };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(org) } as any)
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

  it('gets organization user by id', async () => {
    const organizationUsers = [
      { organization_id: 1, user_id: 1, role_id: null },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
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

  it('creates a post organization request', async () => {
    const name = 'testOrg';
    const organization = {
      id: 0,
      name,
      owner: { id: 0, username: 'testUser' },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
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

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});
