// Written in an async fashion to support a possible future state of storing prefences with an external API.

type PreferenceName = 'default_organization';

export const getPreference = (name: PreferenceName) => {
  const json = localStorage.getItem(name);

  return json !== null
    ? Promise.resolve(JSON.parse(json))
    : Promise.reject(new Error('Preference not present.'));
};

export const setPreference = (name: PreferenceName, value: any) => {
  localStorage.setItem(name, JSON.stringify(value));
  return Promise.resolve(value);
};
