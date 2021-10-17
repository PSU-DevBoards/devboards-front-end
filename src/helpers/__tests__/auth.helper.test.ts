import {
  getAccessToken,
  getAuthenticationHeader,
  setAccessToken,
} from '../auth.helper';

let mockStorage: { [index: string]: any } = {};

describe('authHelper', () => {
  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });

    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
  });

  beforeEach(() => {
    mockStorage = {};
  });

  test('stores token and builds an authentication headder', () => {
    setAccessToken('token');
    expect(getAuthenticationHeader()).toMatchObject({
      Authorization: 'Bearer token',
    });
  });

  test('attempts to get the token from local storage if not in memory', () => {
    setAccessToken(undefined as any);
    global.Storage.prototype.getItem = jest.fn(() => 'test');
    expect(getAccessToken()).toEqual('test');
    expect(global.Storage.prototype.getItem).toBeCalledTimes(1);
  });

  afterAll(() => {
    (global.Storage.prototype.setItem as jest.Mock).mockReset();
    (global.Storage.prototype.getItem as jest.Mock).mockReset();
  });
});
