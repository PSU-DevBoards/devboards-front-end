import DbApiService from './dbapi.service';

export type User = {
  id: number;
  username: string;
};

export type UserOrganization = {
  id: number;
  name: string;
  owner: User;
};

class UserService extends DbApiService {
  public async getCurrentUser(): Promise<User> {
    return this.get(`/users/me`);
  }

  public async getCurrentUserOrganizations(): Promise<Array<UserOrganization>> {
    return this.get(`/users/me/organizations`);
  }
}

export default new UserService();
