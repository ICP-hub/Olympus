import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  principal: null,
  walletConnected: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    walletHandler: (state, action) => {
      const { principalText, WalletType } = action.payload;

      state.principal = principalText;
      state.walletConnected = WalletType;
    },

    WalletSignOut: (state, action) => {
      state.principal = null;
      state.walletConnected = null;
    },

    triggerInternetIdentity: () => {},

    triggerPlugWallet: () => {},

    // triggerAstroxMeWallet: () => {},

    triggeBitfinityWallet: () => {},
  },
});

export const {
  walletHandler,
  WalletSignOut,
  triggerInternetIdentity,
  triggerPlugWallet,
  // triggerAstroxMeWallet,
  triggeBitfinityWallet,
} = authSlice.actions;

export default authSlice.reducer;
