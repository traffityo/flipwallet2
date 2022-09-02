import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import UserReducer from '@persistence/user/UserReducer';
import ThemeReducer from '@persistence/theme/ThemeReducer';
import WalletReducer from '@persistence/wallet/WalletReducer';
import MarketReducer from '@persistence/market/MarketReducer';

const ReduxStore = configureStore({
    reducer: {
        UserReducer,
        ThemeReducer,
        WalletReducer,
        MarketReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export default ReduxStore;
