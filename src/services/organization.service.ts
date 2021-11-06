import DbApiService from './dbapi.service';
import { User } from './user.service';

export type Organization = {
  id: number;
  name: string;
  owner: User;
};

export type OrganizationUser = {
  organization_id: number;
  user_id: number;
  role_id: string;
};

class OrganizationService extends DbApiService {
  public async getOrganizationById(id: number): Promise<Organization> {
    return this.get(`/organizations/${id}`);
  }

  public async getOrganizationUsers(
    id: number
  ): Promise<Array<OrganizationUser>> {
    return this.get(`/organizations/${id}/users`);
  }

  public async createOrganization(
    name: string
  ): Promise<Organization> {
    return this.post(`/organizations`, { name });
  }

  public async inviteUser(
    id: number,
    email: string,
    role_id: number
  ): Promise<OrganizationUser> {
    return this.post(`/organizations/${id}/users`, { email,  role_id });
  }

  public async updateOrganization(
    id: number,
    values: Pick<Organization, 'name'>
  ): Promise<Organization> {
    return this.patch(`/organizations/${id}`, values);
  }

  public async deleteOrganization(id: number) {
    return this.delete(`/organizations/${id}`);
  }
}

export default new OrganizationService();
