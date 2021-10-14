import DbApiService from './dbapi.service';
import { UserOrganization } from './user.service';

export type UserRole = {
  organization_id: number;
  user_id: number;
  role_id: string; 
}

class OrganizationService extends DbApiService {
  public async getOrganizationById(id: number): Promise<UserOrganization> {
    return this.get(`/organizations/${id}`);
  }
  
  public async getOrganizationUsers(id: number): Promise<Array<UserRole>> {
    return this.get(`/organizations/${id}/users`);
  }

  public async createOrganization(orgName: string): Promise<UserOrganization> {
    const orgData = {
      name: orgName
    }

    return this.post(`/organizations`, orgData);
  }
}

export default new OrganizationService();