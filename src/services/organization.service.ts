import DbApiService from './dbapi.service';
import { User } from './user.service';

/* Primary objects for organization request communications */
export type Organization = {
  id: number;
  name: string;
  owner: User;
};

export type OrganizationUser = {
  organizationId: number;
  userId: number;
  roleId: string;
};

/* Organization service for sending organization-related CRUD requests to REST API */
class OrganizationService extends DbApiService {

  /**
   * Gets organization given organzation identifier.
   * @param ID Organization ID.
   * @returns The requested organzation object.
   */
  public async getOrganizationById(id: number): Promise<Organization> {
    return this.get(`/organizations/${id}`);
  }

  /**
   * Gets set of all users within an organization.
   * @param ID Organization ID
   * @returns An array of OrganizationUser objects.
   */
  public async getOrganizationUsers(
    id: number
  ): Promise<Array<OrganizationUser>> {
    return this.get(`/organizations/${id}/users`);
  }

  /**
   * Creates an organization by name.
   * @param Name Organization name.
   * @returns An Organization object for the newly created organization.
   */
  public async createOrganization(name: string): Promise<Organization> {
    return this.post(`/organizations`, { name });
  }

  /**
   * Invites a user to an organization.
   * @param ID Organization ID.
   * @param Email Invitee's email.
   * @param roleID Role to be assigned to new user.
   * @returns An OrganizationUser object belonging to the invited user.
   */
  public async inviteUser(
    id: number,
    email: string,
    roleId: number
  ): Promise<OrganizationUser> {
    return this.post(`/organizations/${id}/users`, { email, roleId });
  }

  /**
   * Updates organization details.
   * @param ID Organization ID.
   * @param Values A single or set of organization attributes to be updated.
   * @returns An Organization object which reflects the requested changes.
   */
  public async updateOrganization(
    id: number,
    values: Pick<Organization, 'name'>
  ): Promise<Organization> {
    return this.patch(`/organizations/${id}`, values);
  }

  /**
   * Deletes organization entirely.
   * @param ID Organization ID.
   */
  public async deleteOrganization(id: number) {
    return this.delete(`/organizations/${id}`);
  }

  /**
   * Get organizations owned by the current user.
   * @returns An array of Organizations belonging to the current authenticated user.
   */
  public async getCurrentUserOrganizations(): Promise<Array<Organization>> {
    return this.get(`/users/me/organizations`);
  }

  /**
   * Get organizations joined by the current user.
   * @returns An array of OrganizationUsers providing the user's role within each organization.
   */
  public async getCurrentUserJoinedOrganizations(): Promise<
    Array<OrganizationUser>
  > {
    return this.get(`/users/me/organizations/joined`);
  }
  
  /**
   * Deletes a user from an organization.
   * @param ID Organization ID.
   * @param UserID User's unique ID.
   */

  public async deleteOrganizationUser(id: number, userId: number) {
    return this.delete(`/organizations/${id}/users/${userId}`);
  }

  public async updateOrganizationUser(
    id: number,
    userId: number,
    values: Pick<OrganizationUser, 'roleId'>
  ) {
    return this.patch(`/organizations/${id}/users/${userId}`, values);
  }
}

export default new OrganizationService();
