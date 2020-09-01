import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import { DateTime } from "luxon"
import stylesEXternal from './styles';
import SmsAndroid from 'react-native-get-sms-android';
import { ListItem, Button, Icon, Subheader } from 'react-native-material-ui';
import { AsyncStorage, TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
const prepareitems = () => { };

const pluck = (array, keys) => {
  return array.map(function (item) {
    return item[key];
  });
};

var styles = StyleSheet.create({
  mainviewStyle: {
    position: "relative",
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 100,
    paddingTop: 120

  },
  footer: {
    position: "absolute",
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#444',
    flexDirection: 'row',
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
    borderTopColor: "#999",
    borderTopWidth: 2
  },
  filters: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#444',
    flexDirection: 'column',
    height: 120,
    alignItems: 'center',
    borderBottomColor: "#999",
    borderBottomWidth: 2
  },

  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange'
  },
  scrollViewStyle: {
    borderWidth: 2,
    borderColor: 'blue'
  }
});

const mystyles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#eeeeee',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#323333',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#323333',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: '#323333',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default function Home({ navigation }) {
  let _menu = null;
  const [value, setValue] = useState({
    items: [],
    interval: null,
    selecteditems: [],
    longPressed: false,
    search: null,
    start_date: null,
    end_date: null,
    showFilter: false
  });
  // const setRead = (message, messages, selected) => {
  //   console.log('setRead');
  //   if (message && value.longPressed == false) {
  //     let msgs = messages.map(item => {
  //       if (item._id == message._id) {
  //         item.read = 1;
  //       }

  //       return item;
  //     });
  //     setValue(prevState => {
  //       return {
  //         ...prevState,
  //         messages: msgs,
  //       };
  //     });
  //     AsyncStorage.setItem('personalAppItems', JSON.stringify(msgs));
  //     navigation.navigate('MessageDetails', {
  //       itemId: message._id,
  //     });
  //   } else if (selected) {
  //     let msgs = messages.map(item => {
  //       if (selected.includes(item._id)) {
  //         item.read = 1;
  //       }
  //       return item;
  //     });
  //     setValue(prevState => {
  //       return {
  //         ...prevState,
  //         messages: msgs,
  //         selectedMessages: [],
  //         longPressed: false,
  //       };
  //     });
  //     AsyncStorage.setItem('personalAppItems', JSON.stringify(msgs));
  //   } else {
  //     let selectedMessages = value.selectedMessages;
  //     let longPressed = value.longPressed;
  //     if (selectedMessages.includes(message._id)) {
  //       selectedMessages = selectedMessages.filter(
  //         item => item.id != message._id,
  //       );
  //     } else {
  //       selectedMessages.push(message._id);
  //     }
  //     if (selectedMessages.length <= 0) {
  //       longPressed = false;
  //     } else {
  //       longPressed = true;
  //     }
  //     setValue(prevState => {
  //       return {
  //         ...prevState,
  //         selectedMessages: selectedMessages,
  //         longPressed: longPressed,
  //       };
  //     });
  //   }
  // };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ padding: 10 }} onPress={() => {
          console.log(value.showFilter)
          setValue(prevState => {
            return { ...prevState, showFilter: value.showFilter?false:true };
          });
        }} ><Icon color="white" name="filter-list" /></TouchableOpacity>
      ),
    });
  }, [navigation]);
  const DEBIT = -1
  const CREDIT = 1
  const storeLocally = msgs => {
    if (msgs) {
      let items = value.items;
      msgs = JSON.parse(msgs);
      msgs = msgs.filter(item => item.body.toLowerCase().indexOf("a/c") >= 0)
      msgs.map(item => {

        let message = items.filter(itm => item._id == itm.msg_id)[0];
        if (!message) {
          let amount = item.body.match(/[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})/)

          let obj = {
            msg_id: item._id,
            id: items.length,
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
      setValue(prevState => {
        return { ...prevState, items: items, selecteditems: items };
      });
      AsyncStorage.setItem('personalAppItems', JSON.stringify(items));
    } else {
      AsyncStorage.getItem('personalAppItems').then(
        data => {
          if (data) {
            setValue(prevState => {
              return { ...prevState, items: JSON.parse(data) };
            });
          } else {
            AsyncStorage.setItem('personalAppItems', '[]');
          }
        },
        e => {
          console.log(e);
        },
      );
    }
  };
  const getSMSes = async () => {
    let filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      // the next 4 filters should NOT be used together, they are OR-ed so pick one
      bodyRegex: '(.*)(credited|debited)(.*)', // content to match
      // the next 2 filters can be used for pagination
    };
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'personal book',
          message: 'Need to read SMS',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS permission');
        SmsAndroid.list(
          JSON.stringify(filter),
          fail => {
            console.log('Failed with this error: ' + fail);
          },
          (count, smsList) => {
            storeLocally(smsList);
          },
        );
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
    console.log('here');
  };
  // const selectItem = id => {
  //   let selecteditems = value.selecteditems;
  //   let longPressed = value.longPressed;
  //   if (selecteditems.includes(id)) {
  //     selecteditems = selecteditems.filter(item => item.id != id);
  //   } else {
  //     selecteditems.push(id);
  //   }
  //   if (selecteditems.length <= 0) {
  //     longPressed = false;
  //   } else {
  //     longPressed = true;
  //   }
  //   setValue(prevState => {
  //     return {
  //       ...prevState,
  //       selecteditems: selecteditems,
  //       longPressed: longPressed,
  //     };
  //   });
  // };
  updateSearch = (search) => {

    setValue(prevState => {
      return {
        ...prevState,
        search: search
      };
    });
  };
  cancelSearch = () => {
    setValue(prevState => {
      return {
        ...prevState,
        search: null
      };
    });
  }
  useEffect(() => {
    storeLocally();

    getSMSes();
    let interval = setInterval(() => {
      getSMSes();
    }, 60000);
    setValue(prevState => {
      return { ...prevState, interval: interval };
    });
  }, []);
  const selecteditems = value.selecteditems.filter(item =>
    (value.search && value.search.length > 0) ? item.message.toLowerCase().indexOf(value.search.toLowerCase()) >= 0 : true
  ).filter(item => value.start_date ? item.date >= DateTime.fromSQL(value.start_date).toMillis() : true).filter(item => value.end_date ? item.date <= DateTime.fromSQL(value.end_date).toMillis() : true)
  
  const credit_amount = selecteditems.filter(item => item.type == CREDIT).map(item => item.amount).reduce((a, b) => a + b, 0)
  const debit_amount = selecteditems.filter(item => item.type == DEBIT).map(item => item.amount).reduce((a, b) => a + b, 0)
  const final_result = credit_amount * CREDIT + debit_amount * DEBIT
  return (
    <View style={{ ...styles.mainviewStyle, paddingTop: value.showFilter ? 120 : 0 }}>
      {value.showFilter && <View style={styles.filters}>
        <View style={{ flex: 1, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <SearchBar

            placeholder="Search for anything ..."
            onChangeText={updateSearch}
            value={value.search}
            onClear={cancelSearch}
            onCancel={cancelSearch}
            containerStyle={{ flex: 10, textAlign: "center", backgroundColor: "#444", borderBottomWidth: 0 }}
            inputContainerStyle={{ backgroundColor: "#333" }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
            <DatePicker
              date={value.start_date}
              mode="date"
              placeholder="from"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36,
                  borderWidth: 0,
                  borderRadius: 3,
                  backgroundColor: "#333",
                  placeholder: "#aaa"
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                console.log(DateTime.fromSQL(date).toMillis())
                setValue(prevState => {
                  return { ...prevState, start_date: date };
                })
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row", padding: 10, textAlign: "right" }}>
            <DatePicker
              date={value.end_date}
              mode="date"
              placeholder="To"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                flex: 1,
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36,
                  borderWidth: 0,
                  borderRadius: 3,
                  backgroundColor: "#333",
                  placeholder: "#aaa"
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                setValue(prevState => {
                  return { ...prevState, end_date: date };
                })
              }}
            />
          </View>

        </View>

      </View>}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={mystyles.scrollView}>
        <View>
          {selecteditems.map((item, index) => (
            <ListItem
              divider
              centerElement={{
                primaryText: item.formatted_amount,
                secondaryText: item.message,
              }}
              dense
              style={{
                primaryText: {
                  color: item.type == DEBIT ? "red" : "green",
                  textAlign: item.type == DEBIT ? "right" : "left"
                }
              }}
              onPress={() => {
                navigation.navigate('MessageDetails', {
                  itemId: item.id,
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, color: "green", fontSize: 20 }}>
            Credit: {credit_amount}
          </Text>
          <Text style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, color: "red", textAlign: "right", fontSize: 20 }}>
            Debit: {debit_amount}
          </Text>
        </View>
        <View style={{ flex: 0.5, flexDirection: "row" }}>
          <Text style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, color: "cyan", textAlign: "center", fontSize: 20 }}>
            Total amount: {final_result}
          </Text>
        </View>
      </View>
    </View>
    // <>
    //   <View
    //     style={{
    //       flex: 1,
    //       flexDirection: 'column'
    //     }}
    //   >
    //     <View
    //       style={{
    //         flex: 1,
    //         flexDirection: 'column',
    //         position:"absolute"
    //       }}>
    //         <View style={{
    //         flex: 1,
    //         flexDirection: 'row',
    //         justifyContent:"space-between"
    //       }}>
    //         <SearchBar
    //           placeholder="Search for anything ..."
    //           onChangeText={updateSearch}
    //           value={value.search}
    //           onClear={cancelSearch}
    //           onCancel={cancelSearch}
    //         />
    //         <TouchableOpacity onPress={()=>{}}  ><Icon name="close"/></TouchableOpacity>
    //         </View>
    //       <View style={{
    //         flex: 1,
    //         flexDirection: 'row',
    //         justifyContent:"space-between"
    //       }}>
    //         <DatePicker
    //           date={value.start_date}
    //           mode="date"
    //           placeholder="from"
    //           format="YYYY-MM-DD"
    //           confirmBtnText="Confirm"
    //           cancelBtnText="Cancel"
    //           customStyles={{
    //             margin:10,
    //             dateIcon: {
    //               position: 'absolute',
    //               left: 0,
    //               top: 4,
    //               marginLeft: 0
    //             },
    //             dateInput: {
    //               marginLeft: 36
    //             }
    //             // ... You can check the source to find the other keys.
    //           }}
    //           onDateChange={(date) => {
    //             console.log(DateTime.fromSQL(date).toMillis())
    //             setValue(prevState => {
    //               return { ...prevState, start_date: date };
    //             })
    //           }}
    //         />
    //         <DatePicker
    //           date={value.end_date}
    //           mode="date"
    //           placeholder="To"
    //           format="YYYY-MM-DD"
    //           confirmBtnText="Confirm"
    //           cancelBtnText="Cancel"
    //           customStyles={{
    //             margin:10,
    //             dateIcon: {
    //               position: 'absolute',
    //               left: 0,
    //               top: 4,
    //               marginLeft: 0
    //             },
    //             dateInput: {
    //               marginLeft: 36
    //             }
    //             // ... You can check the source to find the other keys.
    //           }}
    //           onDateChange={(date) => {
    //             setValue(prevState => {
    //               return { ...prevState, end_date: date };
    //             })
    //           }}
    //         />
    //       </View>

    //     </View>
    //     <View >
    //       <ScrollView
    //         contentInsetAdjustmentBehavior="automatic"
    //         style={mystyles.scrollView}>
    //         <View>
    //           {selecteditems.map((item, index) => (
    //             <ListItem
    //               divider
    //               centerElement={{
    //                 primaryText: item.formatted_amount,
    //                 secondaryText: item.message,
    //               }}
    //               dense
    //               style={{
    //                 primaryText: {
    //                   color: item.type == DEBIT ? "red" : "green",
    //                   textAlign: item.type == DEBIT ? "right" : "left"
    //                 }
    //               }}
    //               onPress={() => {
    //                 navigation.navigate('MessageDetails', {
    //                   itemId: item.id,
    //                 });
    //               }}
    //             />
    //           ))}
    //         </View>
    //       </ScrollView>
    //     </View>
    //     <View >
    //       <ListItem
    //               divider
    //               centerElement={{
    //                 primaryText: "Credit: "+credit_amount+" Debit: "+debit_amount+" Total amount: "+final_result
    //               }}
    //               dense
    //               style={{
    //                 primaryText: {
    //                   color: "Blue",
    //                 }
    //               }}
    //             />
    //     </View>
    //   </View>
    // </>
  );
}
