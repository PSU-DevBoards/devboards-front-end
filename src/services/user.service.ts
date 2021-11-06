import DbApiService from './dbapi.service';

export type User = {
  id: number;
  username: string;
};

export type Organization = {
  id: number;
  name: string;
  owner: User;
};

export type OrganizationUser = {
  organization_id: number;
  user_id: number;
  role_id: number;
}

class UserService extends DbApiService {
  public async getCurrentUser(): Promise<User> {
    return this.get(`/users/me`);
  }

  public async getCurrentUserOrganizations(): Promise<Array<Organization>> {
    return this.get(`/users/me/organizations`);
  }

  public async getCurrentUserJoinedOrganizations(): Promise<Array<OrganizationUser>> {
    return this.get(`/users/me/organizations/joined`);
  }
}

export default new UserService();
