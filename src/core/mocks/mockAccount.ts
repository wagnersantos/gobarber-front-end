export const mockDataAccount = {
  user: {
    id: 'user123',
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar_url: 'image-test.jpg',
  },
  token: 'token123',
};

export const mockAccount = (getItemSpy = jest.fn()): void => {
  getItemSpy.mockImplementation(key => {
    switch (key) {
      case '@GoBarber:token':
        return mockDataAccount.token;
      case '@GoBarber:user':
        return JSON.stringify(mockDataAccount.user);
      default:
        return null;
    }
  });
};
