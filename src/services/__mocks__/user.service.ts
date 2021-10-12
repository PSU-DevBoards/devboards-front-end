const stub = {
  getCurrentUser: () =>
    Promise.resolve({
      id: 1,
      username: 'testUser',
    }),
};

export default stub;
