import RoleService from '../role.service';

describe('RoleService', () => {
  it('list all roles', async () => {
    const roles = [{ id: 1, name: 'Developer' }];

    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(roles),
      } as any)
    );

    const retreivedRoles = await RoleService.listRoles();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/roles'),
      expect.anything()
    );
    expect(retreivedRoles).toEqual(roles);
  });
});
