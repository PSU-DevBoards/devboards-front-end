import userService from '../user.service';

describe('userService', () => {
  it('gets the current user', async () => {
    const user = { id: 1, username: 'test' };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(user) } as any)
    );

    const currentUser = await userService.getCurrentUser();

    expect(currentUser).toEqual(user);
    expect(global.fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });

  it('gets the current user organizations', async () => {
    const org = [
      { id: 1, name: 'testOrg', owner: { id: 1, username: 'test' } },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(org) } as any)
    );

    const currentUserOrgs = await userService.getCurrentUserOrganizations();

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
});
