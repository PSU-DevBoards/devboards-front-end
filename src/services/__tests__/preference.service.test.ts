/* eslint-disable no-proto */
import { getPreference, setPreference } from '../preference.service';

const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
const getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');

describe('PreferenceService', () => {
  test('getPreference resolves parsed JSON if preference exists', async () => {
    getItemSpy.mockReturnValueOnce(JSON.stringify({ id: 1 }));

    const { id } = await getPreference('default_organization');

    expect(getItemSpy).toBeCalledWith('default_organization');
    expect(id).toEqual(1);
  });

  test('getPreference rejects if preference does not exist', () => {
    getItemSpy.mockReturnValueOnce(null);

    expect(getPreference('default_organization')).rejects.toEqual(
      new Error('Preference not present')
    );
  });

  test('setPreference stores string and resolves', () => {
    expect(setPreference('default_organization', { id: 1 })).resolves.toEqual({
      id: 1,
    });
    expect(setItemSpy).toHaveBeenCalledWith(
      'default_organization',
      JSON.stringify({ id: 1 })
    );
  });

  afterEach(() => {
    setItemSpy.mockClear();
    getItemSpy.mockClear();
  });
});
