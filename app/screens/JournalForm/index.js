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
export default function JournalForm(props) {
  const { itemId } = props.route.params;
  const [value, setValue] = useState({
    item: null,
    interval: null,
    messages: null,
    submitting: false
  });

  useEffect(() => {
   if(itemId){
     props.getItem(itemId)
   }
  }, []);
  useEffect(()=>{
    if(props.item){
      setValue(prevState => {
        return { ...prevState, item: props.item };
      });
    }
  },[props.item])

 
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
            let credit=0, debit=0
            for (let i = 0; i < values.item.data.length; i++) {
              credit += values.item.data[i].credit
              debit += values.item.data[i].debit
            }
            item=values.item || defaultItem;
            item.amount = credit + debit * -1
            item.type = item.amount >= 0 ? 1 : -1
            item.amount = Math.abs(item.amount)
            item.formatted_amount = item.amount
            if(itemId){
                props.updateItem(item);
            }
            else{
              props.addItem(item);
            }
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
const mapStateToProps = state => {
  return {
    item: state["items"].item
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getItem: (data) =>
      dispatch(Actions.getItem(data)),
    addItem: (data) =>
      dispatch(Actions.addItem(data)),
    updateItem: (data) =>
      dispatch(Actions.updateItem(data)),
    removeItem: (data) =>
      dispatch(Actions.removeItem(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
