import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // we use saga, not thunk
      serializableCheck: false, // keep false if you store non-serializable values
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
