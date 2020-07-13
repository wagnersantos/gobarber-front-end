import {
  renderHook,
  act,
  RenderHookResult,
} from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { useAuth, AuthProvider, AuthContextDTO } from '../../core/hooks/Auth';
import { mockDataAccount, mockAccount } from '../../core/mocks/mockAccount';

import api from '../../core/provider/api';

const apiMock = new MockAdapter(api);

const sutFactory = (): RenderHookResult<unknown, AuthContextDTO> => {
  return renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
};

const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

const compareStorage = (
  item: jest.SpyInstance<void, [string, string]>,
  key: string,
  value: unknown,
): void => {
  expect(item).toHaveBeenCalledWith(key, value);
};

describe('Auth hook', () => {
  beforeEach(() => {
    setItemSpy.mockClear();
    getItemSpy.mockClear();
    removeItemSpy.mockClear();
  });

  it('should be able to sigin', async () => {
    const { user, token } = mockDataAccount;

    apiMock.onPost('/sessions').reply(200, mockDataAccount);

    const { result, waitForNextUpdate } = sutFactory();

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(result.current.user.email).toEqual(user.email);
    compareStorage(setItemSpy, '@GoBarber:token', token);
    compareStorage(setItemSpy, '@GoBarber:user', JSON.stringify(user));
  });

  it('should restore saved data from storage whgen auth inits', async () => {
    mockAccount();
    const { result } = sutFactory();
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    mockAccount();
    const { result } = sutFactory();
    act(() => result.current.signOut());
    expect(removeItemSpy).toBeCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const { result } = sutFactory();
    const { user } = mockDataAccount;
    act(() => {
      result.current.updateUser(user);
    });
    compareStorage(setItemSpy, '@GoBarber:user', JSON.stringify(user));
    expect(result.current.user).toEqual(user);
  });
});
