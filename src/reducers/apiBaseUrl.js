import { createSlice } from '@reduxjs/toolkit'
export const apiBaseUrlSlice = createSlice({
  name: 'apiBaseUrl',
  initialState: {
    value: "http://localhost:1337/api/v1",
  },
  /*reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value = state.value - 1
    },
  },*/
})
//export const { increment, decrement } = counterSlice.actions
export default apiBaseUrlSlice.reducer