
const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}


export const GETITEMS = createRequestTypes("GETITEMS");
export const ASKPERMISSION = createRequestTypes("ASKPERMISSION");
export const GETITEM = "GETITEM";
export const ADDITEM = "ADDITEM";
export const UPDATEITEM = "UPDATEITEM";
export const REMOVEITEM = "REMOVEITEM";
function action(type, payload = {}) {
  return { type, ...payload };
}

export function getItem(payload) {
  return { type: "GETITEM", payload };
}
export function addItem(payload) {
  return { type: "ADDITEM", payload };
}
export function updateItem(payload) {
  return { type: "UPDATEITEM", payload };
}
export function removeItem(payload) {
  return { type: "REMOVEITEM", payload };
}


export const getItems = {
  request: (data) => action(GETITEMS[REQUEST], { data }),
  success: (data, response) => action(GETITEMS[SUCCESS], { data, response }),
  failure: (data, error) => action(GETITEMS[FAILURE], { data, error }),
};

export const askPermission = {
  request: (data) => action(ASKPERMISSION[REQUEST], { data }),
  success: (data, response) => action(ASKPERMISSION[SUCCESS], { data, response }),
  failure: (data, error) => action(ASKPERMISSION[FAILURE], { data, error }),
};


