import DbApiService from './dbapi.service';

/* Primary objects for user request responses */
export type User = {
  id: number;
  username: string;
};

/* User service for sending user-related CRUD requests to API */
class UserService extends DbApiService {

  /**
   * Gets current user data.
   * @returns A User object containing the information of the currently authenticated user.
   */
  public async getCurrentUser(): Promise<User> {
    return this.get(`/users/me`);
  }
}

export default new UserService();
