import * as ActionTypes from "../actions";
import { DateTime } from "luxon"
const DEBIT = -1
const CREDIT = 1
const intialState = {
  loading: false,
  till:0,
  items:[],
  premission:false,
  item:null,
  error:null,
  custom_id:0
};


export default (state = intialState, action) => {
  let cart = null;
  switch (action.type) {
    
    
    case ActionTypes.ASKPERMISSION.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.ASKPERMISSION.SUCCESS:
      return {
        ...state,
        isLoading: false,
        premission: true
      };
    case ActionTypes.ASKPERMISSION.FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.errors
      };

    case ActionTypes.GETITEMS.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.GETITEMS.SUCCESS:
      var items=state.items;
      var custom_id=state.custom_id;
      msgs = JSON.parse(action.response);
      msgs = msgs.filter(item => item.body.toLowerCase().indexOf("a/c") >= 0)
      msgs.map(item => {

        let message = items.filter(itm => item._id == itm.msg_id)[0];
        if (!message) {
          let amount = item.body.match(/[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})/)

          let obj = {
            msg_id: item._id,
            id: custom_id++,
            message: item.body,
            date: item.date,
            type: item.body.indexOf("debited") >= 0 ? DEBIT : CREDIT,
            formatted_date: DateTime.fromMillis(item.date).toLocaleString(DateTime.DATETIME_SHORT),
            amount: parseFloat(amount[0].replace(",", "")),
            formatted_amount: amount
          }
          items.push(obj)
        }
        return item;
      });
      return {
        ...state,
        isLoading: false,
        items: items,
        custom_id:custom_id
      };
    case ActionTypes.GETITEMS.FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.errors
      };
    case ActionTypes.GETITEM:
      return {
        ...state,
        isLoading: false,
        item:state.items?state.items.filter(item=>item.id=action.payload)[0]:null
      };
    case ActionTypes.UPDATEITEM:
      let exists=false
      let items=state.items.map(item=>{
        if(item.id==action.payload.id){
          exists=true
          return action.payload
        }
        item
      })
      return {
        ...state,
        isLoading: false,
        item:exists?action.payload:null,
        items:items
      };
    case ActionTypes.ADDITEM:
      custom_id=state.custom_id
      let item=action.payload
      item.id=custom_id++
      let items=state.items
      items.push(item)
      return {
        ...state,
        isLoading: false,
        item:item,
        custom_id:custom_id,
        items:items
      };
    case ActionTypes.REMOVEITEM:
      return {
        ...state,
        isLoading: false,
        item:state.items?state.items.filter(item=>item.id=action.payload)[0]:null
      };
  
    default:
      return state;
  }
};
