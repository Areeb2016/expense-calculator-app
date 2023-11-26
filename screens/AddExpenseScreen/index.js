import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  Modal,
  Portal,
  Text,
  FAB,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddExpenseScreen = ({ route, navigation }) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const categories = [
    "Food",
    "Transportation",
    "House Utilities",
    "Entertainment",
    "Medication",
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpenseDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleAddExpense = async () => {
    if (!expenseName || !expenseCategory || !expenseAmount || !expenseDate) {
      alert("Please fill in all required fields");
      return;
    }

    const user = await AsyncStorage.getItem("userData");
    const id = JSON.parse(user).userId;

    const newExpense = {
      user: id,
      name: expenseName,
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
      date: expenseDate,
      description: expenseDescription,
    };

    const response = await api.create(newExpense);

    setExpenseName("");
    setExpenseCategory("");
    setExpenseAmount("");
    setExpenseDate(new Date());
    setExpenseDescription("");

    if (response.success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#00cc99" />
      <Title style={styles.title}>Add Expense</Title>

      <TextInput
        label="Name"
        value={expenseName}
        onChangeText={(text) => setExpenseName(text)}
        style={styles.input}
        mode="outlined"
      />

      <TouchableOpacity onPress={showModal}>
        <TextInput
          editable={false}
          label="Category"
          value={expenseCategory}
          style={styles.input}
          mode="outlined"
        />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              onPress={() => {
                setExpenseCategory(category);
                hideModal();
              }}
              key={index}
            >
              <Text style={styles.text}>{category}</Text>
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>

      <TextInput
        label="Amount/Price"
        value={expenseAmount}
        onChangeText={(text) => setExpenseAmount(text)}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TouchableOpacity onPress={showDatepicker}>
        <TextInput
          label="Date"
          value={expenseDate.toISOString().split("T")[0]}
          editable={false}
          style={styles.input}
          onTouchStart={showDatepicker}
          mode="outlined"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expenseDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        label="Description"
        value={expenseDescription}
        onChangeText={(text) => setExpenseDescription(text)}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleAddExpense} style={styles.button}>
        Add Expense
      </Button>

      <FAB
        style={styles.fab}
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    marginTop: 80,
  },
  input: {
    marginBottom: 16,
  },
  dateInput: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  dateInputText: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#00cc99",
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 30,
    gap: 20,
    marginHorizontal: 30,
  },
  text: {
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    top: 0,
    backgroundColor: "#00cc99",
  },
});

export default AddExpenseScreen;
