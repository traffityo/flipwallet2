import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

export const StorageService = {
    StorageSetItem,
    StorageGetItem,
    StorageDeleteItem,
    StorageClearAll,
};

async function StorageSetItem(key, value, encrypted) {
    if (encrypted) {
        try {
            await EncryptedStorage.setItem(key, value);
            return true;
        } catch (error) {
            return error;
        }
    } else {
        try {
            await AsyncStorage.setItem(key, value);
            return true;
        } catch (error) {
            return error;
        }
    }
}

async function StorageGetItem(
    key: string,
    encrypted: boolean = true,
    json: boolean = false,
) {
    if (encrypted) {
        try {
            const value = await EncryptedStorage.getItem(key);
            if (value !== undefined) {
                return json ? JSON.parse(value) : value;
            }
        } catch (error) {
            return error;
        }
    } else {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== undefined) {
                return json ? JSON.parse(value) : value;
            }
        } catch (error) {
            return error;
        }
    }
}

async function StorageDeleteItem(key: string, encrypted: boolean = true) {
    if (encrypted) {
        try {
            await EncryptedStorage.removeItem(key);
            return true;
        } catch (error) {
            return error;
        }
    } else {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            return error;
        }
    }
}

async function StorageClearAll() {
    try {
        await EncryptedStorage.clear();
        await AsyncStorage.clear();
    } catch (error) {
        return error;
    }
}
