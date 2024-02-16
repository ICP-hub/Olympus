import { createSlice } from '@reduxjs/toolkit';

const initialActorState = {
  actor: null, 
};

export const actorSlice = createSlice({
  name: 'actors',
  initialState: initialActorState,
  reducers: {
    setActor: (state, action) => {
      console.log("actor inside reducer", action)
      state.actor = action.payload; 
    },
  },
});

export const { setActor } = actorSlice.actions;
export default actorSlice.reducer;
