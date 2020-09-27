import { API_ROOT } from "./constants";
import {
  View,
  Text,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';



function callAPI(endpoint, headers, body, isDelete) {
  const fullURL =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;
  return fetch(fullURL, {
    headers,
    body,
    method: body ? (isDelete ? "DELETE" : "POST") : "GET",
  }).then((response) =>{
      if(response.status==204){
        console.log("dfdfgddfdgf");
        return { ok: true, status: 204,response:"removed" }
      }
      return response
      .json()
      .then((json) => ({ json, response }))
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        (response) => ({ response }),
        (error) => ({ error: error.message || "Somehing gone wrong" })
      )
  }
    
  );
}

function getParams(data) {
  return Object.keys(data)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");
}


export const askPermission=()=>{
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: 'personal book',
      message: 'Need to read SMS',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  ).then((data)=>{
      return { ok: true, status: 200, response: true};
  },(err)=>{
    return { error: fail || "Something gone wrong" }
  })
}

export const getItems=(data)=>{
  let filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
    // the next 4 filters should NOT be used together, they are OR-ed so pick one
    bodyRegex: '(.*)(credited|debited)(.*)', // content to match
    // the next 2 filters can be used for pagination
    indexFrom: data.page*20, // start from index 0
    maxCount: 20, // count of SMS to return each time
  };
  return new Promise((resolve,reject)=>{
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('Failed with this error: ' + fail);
        reject({ error: fail || "Something gone wrong" })
      },
      (count, smsList) => {
        resolve({ ok: true, status: 200, response: smsList});
      },
    )
  })
  
}

