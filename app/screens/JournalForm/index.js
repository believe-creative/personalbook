import React, { useState, useEffect } from 'react';
import {
  Text,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { DateTime } from "luxon"
import styles from './styles';
import { AsyncStorage } from 'react-native';
import { Button, TextInput, View, TouchableOpacity, Switch } from 'react-native';
import { ListItem, Icon, Subheader } from 'react-native-material-ui';
import { Formik } from 'formik';
import * as Actions from "../../actions";
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
const today = DateTime.local()
const defaultItem = {
  msg_id: null,
  journal: true,
  id: null,
  message: "User Journal",
  date: today.toMillis(today),
  type: 0,
  formatted_date: today.toLocaleString(DateTime.DATETIME_SHORT),
  amount: 0,
  formatted_amount: 0,
  data: [{ name: "", debit: 0, credit: 0 }]
}
export default function JournalForm({ route, navigation }) {
  const { itemId } = route.params;
  const [value, setValue] = useState({
    item: null,
    interval: null,
    messages: null,
    submitting: false
  });

  useEffect(() => {
    AsyncStorage.getItem('personalAppItems').then(
      data => {
        if (data) {
          let messages = JSON.parse(data);
          let message = messages.filter(item => item.id == itemId)[0];
          console.log(message)
          setValue(prevState => {
            return { ...prevState, messages: messages, item: message };
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
        <Formik
          initialValues={{ item: value.item || { ...defaultItem } }}

          onSubmit={values => {
            setValue(prevState => {
              return { ...prevState, submitting: true };
            });
            let messages = value.messages;
            let message = messages.filter(message => message.id == itemId)
            values.item.id = (values.item.id || itemId) ? (values.item.id || itemId) : messages.length
            let credit=0, debit=0
            for (let i = 0; i < values.item.data.length; i++) {
              credit += values.item.data[i].credit
              debit += values.item.data[i].debit
            }
            values.item.amount = credit + debit * -1
            values.item.type = values.item.amount >= 0 ? 1 : -1
            values.item.amount = Math.abs(values.item.amount)
            values.item.formatted_amount = values.item.amount
            if (itemId) {
              messages = messages.map(message => {
                if (message.id == values.item.id) {
                  message = values.item
                }
                return message
              })
            }
            else {
              messages.push(values.item)
            }

            AsyncStorage.setItem('personalAppItems', JSON.stringify(messages)).then(
              data => {
                setValue(prevState => {
                  return { ...prevState, submitting: false, messages: messages };
                });
                navigation.navigate('Home');
              },
              e => {
                console.log(e);
              },
            );
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, submitForm }) => (
            <View style={{ margin: 5 }}>
              {values.item.data.map((item) => (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ flex: 0.5, display: "flex", flexDirection: "row", borderColor: "#555555", borderWidth: 1 }}>
                    <TextInput
                      onChangeText={handleChange}
                      onBlur={handleBlur}
                      onChangeText={(value, e) => {
                        item.name = value
                        setFieldValue("item", values.item)
                      }}
                      placeholder="name"
                      style={{ width: "100%" }}
                      value={item.name}
                    />
                  </View>

                  <View style={{ flex: 0.25, display: "flex", flexDirection: "row", borderColor: "#555555", borderWidth: 1 }}>
                    <TextInput
                      onChangeText={(value, e) => {
                        item.credit = value
                        setFieldValue("item", values.item)
                      }}
                      style={{ width: "100%" }}
                      placeholder="credit"
                      keyboardType="numeric"
                      onBlur={handleBlur}
                      value={item.credit}
                    />
                  </View>
                  <View style={{ flex: 0.25, display: "flex", flexDirection: "row", borderColor: "#555555", borderWidth: 1 }}>
                    <TextInput
                      onChangeText={(value, e) => {
                        item.debit = value
                        setFieldValue("item", values.item)
                      }}
                      style={{ width: "100%" }}
                      placeholder="debit"
                      keyboardType="numeric"
                      onBlur={handleBlur}
                      value={item.debit}
                    />
                  </View>
                </View>
              ))}
              <View style={{ marginTop: 5 }}>
                <Button onPress={handleSubmit} title="Add a row" color="#009933" disabled={value.submitting} onPress={() => {
                  values.item.data.push({ name: "", debit: 0, credit: 0 })
                  setFieldValue("item", values.item)
                }} />
              </View>
              <View style={{ marginTop: 5 }}>
                <Button onPress={handleSubmit} style={{ marginTop: 5 }} disabled={value.submitting} title="Save" />
              </View>

            </View>
          )}
        </Formik>

      </ScrollView>
    </>
  );
}
