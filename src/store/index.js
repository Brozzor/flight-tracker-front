import { configureStore } from '@reduxjs/toolkit'
import apiBaseUrl from '../reducers/apiBaseUrl'

export default configureStore({
  reducer: {
    apiBaseUrl: apiBaseUrl,
  },
})