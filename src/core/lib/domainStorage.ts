import AsyncStorage from '@react-native-async-storage/async-storage';

const DOMAIN_NAME_KEY = 'domainName';
const DOMAIN_KEY = 'apiDomain';

export type StoredWorkspace = { domainName: string; domain: string };

export const domainStorage = {
  get: async (): Promise<StoredWorkspace | null> => {
    const [[, domainName], [, domain]] = await AsyncStorage.multiGet([DOMAIN_NAME_KEY, DOMAIN_KEY]);
    return domainName && domain ? { domainName, domain } : null;
  },
  set: (w: StoredWorkspace) =>
    AsyncStorage.multiSet([
      [DOMAIN_NAME_KEY, w.domainName],
      [DOMAIN_KEY, w.domain],
    ]),
  clear: () => AsyncStorage.multiRemove([DOMAIN_NAME_KEY, DOMAIN_KEY]),
};
