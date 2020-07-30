import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import styles from './styles';
import SmsAndroid from 'react-native-get-sms-android';
import { ListItem, Button, Icon, Subheader } from 'react-native-material-ui';
import { AsyncStorage } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
const prepareMessages = () => {};

const pluck = (array, keys) => {
  return array.map(function(item) {
    return item[key];
  });
};

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
    messages: [],
    interval: null,
    selectedMessages: [],
    longPressed: false,
  });
  const setRead = (message, messages, selected) => {
    console.log('setRead');
    if (message && value.longPressed == false) {
      let msgs = messages.map(item => {
        if (item._id == message._id) {
          item.read = 1;
        }

        return item;
      });
      setValue(prevState => {
        return {
          ...prevState,
          messages: msgs,
        };
      });
      AsyncStorage.setItem('personalAppMsgs', JSON.stringify(msgs));
      navigation.navigate('MessageDetails', {
        itemId: message._id,
      });
    } else if (selected) {
      let msgs = messages.map(item => {
        if (selected.includes(item._id)) {
          item.read = 1;
        }
        return item;
      });
      setValue(prevState => {
        return {
          ...prevState,
          messages: msgs,
          selectedMessages: [],
          longPressed: false,
        };
      });
      AsyncStorage.setItem('personalAppMsgs', JSON.stringify(msgs));
    } else {
      let selectedMessages = value.selectedMessages;
      let longPressed = value.longPressed;
      if (selectedMessages.includes(message._id)) {
        selectedMessages = selectedMessages.filter(
          item => item.id != message._id,
        );
      } else {
        selectedMessages.push(message._id);
      }
      if (selectedMessages.length <= 0) {
        longPressed = false;
      } else {
        longPressed = true;
      }
      setValue(prevState => {
        return {
          ...prevState,
          selectedMessages: selectedMessages,
          longPressed: longPressed,
        };
      });
    }
  };
  const storeLocally = msgs => {
    if (msgs) {
      msgs = JSON.parse(msgs).map(item => {
        let message = value.messages.filter(itm => item._id == itm._id)[0];
        if (message) item.read = message.read;
        return item;
      });
      setValue(prevState => {
        return { ...prevState, messages: msgs };
      });
      AsyncStorage.setItem('personalAppMsgs', JSON.stringify(msgs));
    } else {
      AsyncStorage.getItem('personalAppMsgs').then(
        data => {
          if (data) {
            setValue(prevState => {
              return { ...prevState, messages: JSON.parse(data) };
            });
          } else {
            AsyncStorage.setItem('personalAppMsgs', '[]');
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
  const selectItem = id => {
    let selectedMessages = value.selectedMessages;
    let longPressed = value.longPressed;
    if (selectedMessages.includes(id)) {
      selectedMessages = selectedMessages.filter(item => item.id != id);
    } else {
      selectedMessages.push(id);
    }
    if (selectedMessages.length <= 0) {
      longPressed = false;
    } else {
      longPressed = true;
    }
    setValue(prevState => {
      return {
        ...prevState,
        selectedMessages: selectedMessages,
        longPressed: longPressed,
      };
    });
  };
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
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}>
        {value.longPressed && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 40,
            }}>
            <Button
              onPress={() => {
                setRead(null, value.messages, value.selectedMessages);
              }}
              primary
              text="Mark as read"
            />
            <Button
              onPress={() => {
                setValue(prevState => {
                  return {
                    ...prevState,
                    selectedMessages: value.messages.map(item => item._id),
                    longPressed: true,
                  };
                });
              }}
              primary
              text="Select all"
            />
            <Button
              onPress={() => {
                console.log('close');
                setValue(prevState => {
                  return {
                    ...prevState,
                    selectedMessages: [],
                    longPressed: false,
                  };
                });
              }}
              primary
              icon="close"
              text=""
            />
          </View>
        )}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={mystyles.scrollView}>
          <View>
            {value.messages.map((sms, index) => (
              <ListItem
                divider
                centerElement={{
                  primaryText: sms.body,
                }}
                dense
                style={{
                  primaryText: {
                    fontWeight: sms.read == 0 ? 'bold' : 'normal',
                  },
                  container: {
                    backgroundColor: value.selectedMessages.includes(sms._id)
                      ? '#cccccc'
                      : '#ffffff',
                  },
                }}
                onPress={() => {
                  setRead(sms, value.messages);
                }}
                onLongPress={() => {
                  selectItem(sms._id);
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
