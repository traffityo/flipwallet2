import {createSlice} from '@reduxjs/toolkit';

const MarketReducer = createSlice({
    name: 'market',
    initialState: {
        topCoins: [],
    },
    reducers: {
        getTopCoinsSuccess(state, {payload}) {
            state.topCoins = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = MarketReducer;
// Extract and export each action creator by name
export const {getTopCoinsSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
