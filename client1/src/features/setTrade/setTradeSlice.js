import { createSlice } from "@reduxjs/toolkit";

const setTradeSlice = createSlice({
    name: "setTrade",
    initialState: {
        items: []
    },
    reducers: {
        addTrade: (state, action) => {
            const { name, price, quantity } = action.payload;
            state.items.push({ name, price, quantity });
        },
        removeTrade: (state, action) => {
            const { name } = action.payload;
            state.items = state.items.filter(item => item.name !== name);
        },
    },
});

export const { addTrade, removeTrade } = setTradeSlice.actions;
export default setTradeSlice.reducer;