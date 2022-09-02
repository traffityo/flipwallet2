import SensitiveInfoStorage from 'react-native-sensitive-info';
import CacheStorage from 'react-native-cache-storage';
const cacheStorage = new CacheStorage();

const storageConfig = {
  sharedPreferencesName: '@butler-712638173',
  keychainService: '@butler-513961259',
};
async function getItem(key) {
  const data = await SensitiveInfoStorage.getItem(key, storageConfig).then(
    item => item || null,
  );
  return data != null ? JSON.parse(data) : null;
}

async function setItem(key, value) {
  return await SensitiveInfoStorage.setItem(
    key,
    JSON.stringify(value) || null,
    storageConfig,
  );
}

async function deleteItem(key) {
  return await SensitiveInfoStorage.deleteItem(key, storageConfig);
}
async function clear() {}
async function setCachedItem(key, value,ttl) {
  await cacheStorage.setItem(key, value,ttl)
}
async function getCachedItem(key) {
  return await cacheStorage.getItem(key)
}

export const StorageUtil = {
  getItem,
  setItem,
  deleteItem,
  clear,
  setCachedItem,
  getCachedItem
};
