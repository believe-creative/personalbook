import { combineReducers } from "redux-immutable";
import { connectRouter } from "connected-react-router";
import ItemsReducer from "./items";

export default  
   {
    items: ItemsReducer
  };

