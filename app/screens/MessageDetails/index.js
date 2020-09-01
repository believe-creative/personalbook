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
import { ListItem, Card } from 'react-native-material-ui';
import { AsyncStorage } from 'react-native';
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

export default function MessageDetails({ route, navigation }) {
  const { itemId } = route.params;
  const [value, setValue] = useState({
    message: null,
    interval: null,
  });

  useEffect(() => {
    console.log(itemId)
    AsyncStorage.getItem('personalAppItems').then(
      data => {
        if (data) {
          let messages = JSON.parse(data);
          let message = messages.filter(item => item.id == itemId)[0];
          console.log(message)
          setValue(prevState => {
            return { ...prevState, messages: messages, message: message.message };
          });
        }
      },
      e => {
        console.log(e);
      },
    );
  }, []);
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={mystyles.scrollView}>
        
          <Card>
          <View style={{padding:10}}>
              <Text>{value.message}</Text>
              </View>
          </Card>
        
      </ScrollView>
    </>
  );
}
