import { createSlice } from "@reduxjs/toolkit";

const tradeDetailSlice = createSlice({
    name: "tradeDetail",
    initialState: {
        tradePrice: 0.0,
        tradeDate: "",
        tradeQuantity: 0,
        tradeTicker: "",
    },
    reducers: {
        setTradeDetail: (state, action) => {
        const { tradeDetail, tradeHistory } = action.payload;
        state.tradeDetail = tradeDetail;
        state.tradeHistory = tradeHistory;
        },
    },
    });

export const { setTradeDetail } = tradeDetailSlice.actions;
export default tradeDetailSlice.reducer;
