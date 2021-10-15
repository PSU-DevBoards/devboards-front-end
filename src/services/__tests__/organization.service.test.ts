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
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });

  it('gets organization user by id', async () => {
    const orgRole = [{ organization_id: 1, user_id: 1, role_id: null }];
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(orgRole) } as any)
    );

    const searchOrg = await organizationService.getOrganizationUsers(1);

    expect(searchOrg).toEqual(orgRole);
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
});
