import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import transactionReducer from "./transactionSlice";
import budgetReducer from "./budgetSlice";
import insightReducer from "./insightSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budget: budgetReducer,
    insight: insightReducer,
  },
});

export default store;
