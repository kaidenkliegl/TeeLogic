import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import golferSlice from "./golfers/golferSlice";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import dateSlice from "./calender/dateSlice"
import teeTimeSlice from "./teeTimes/teeTimeSlice"
import reservationSlice from "./reservation/reservationSlice"
import PricingSlice from "./pricing/pricingSlice"

const rootReducer = combineReducers({
  session: sessionReducer,
  golfers: golferSlice.reducer,
  date: dateSlice,
  teetimes: teeTimeSlice,
  reservations: reservationSlice,
  pricing: PricingSlice
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
