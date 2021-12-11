/* Provide expected user service request responses for unit tests */
const UserService = {
  getCurrentUser: () =>
    Promise.resolve({
      id: 1,
      username: 'testUser',
    }),
};

export default UserService;
