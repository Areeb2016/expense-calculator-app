import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  Title,
  FAB,
  IconButton,
  Card,
  Paragraph,
  TextInput,
  Portal,
  Modal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [expenseDate, setExpenseDate] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("");

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

  const getExpense = async () => {
    try {
      const user = await AsyncStorage.getItem("userData");
      const id = JSON.parse(user).userId;

      const response = await api.read(id);

      setExpenses(response);
      setFilteredExpenses(response);
    } catch (error) {
      console.log("error");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await getExpense();
      };

      fetchData();

      return () => {};
    }, [])
  );

  useEffect(() => {
    getExpense();
  }, []);

  useEffect(() => {
    if (expenseDate || expenseCategory) {
      applyFilters();
    }
  }, [expenseDate, expenseCategory]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleEditExpense = (id) => {
    const expenseToEdit = expenses.find((expense) => expense._id === id);

    navigation.navigate("Edit", { expenseToEdit });
  };

  const handleDeleteExpense = async (id) => {
    const updatedExpenses = expenses.filter((expense) => expense._id !== id);

    const user = await AsyncStorage.getItem("userData");
    const userId = JSON.parse(user).userId;

    const body = {
      user: userId,
    };

    try {
      const response = await api.delete(id, body);
      // setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (event.type == "set" && selectedDate) {
      setExpenseDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const applyFilters = () => {
    const filtered = expenses.filter((expense) => {
      const dateMatch =
        !expenseDate ||
        new Date(expense.date).toDateString() ===
          new Date(expenseDate).toDateString();

      const categoryMatch =
        !expenseCategory ||
        expense.category.toLowerCase().includes(expenseCategory.toLowerCase());

      return dateMatch && categoryMatch;
    });

    setFilteredExpenses(filtered);
  };

  const clear = async () => {
    setFilteredExpenses(expenses);
    setExpenseDate();
    setExpenseCategory("");
  };

  const renderExpenseItem = ({ item }) => (
    <Card style={styles.card} key={item._id}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>
          {`${item.category} - $${item.amount.toFixed(2)} - ${formatDate(
            item.date
          )} - ${item.description}`}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="pencil"
          iconColor="#fff"
          mode="contained"
          onPress={() => handleEditExpense(item._id)}
          style={{ backgroundColor: "#00cc99" }}
        />
        <IconButton
          icon="delete"
          iconColor="#fff"
          mode="contained"
          onPress={() => handleDeleteExpense(item._id)}
          style={{ backgroundColor: "#00cc99" }}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#00cc99" />

      <Text style={styles.list}>Expenses</Text>

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

      <TouchableOpacity onPress={showDatepicker}>
        <TextInput
          label="Date"
          value={expenseDate ? formatDate(expenseDate) : ""}
          editable={false}
          style={styles.input}
          mode="outlined"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expenseDate || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text onPress={() => clear()} style={styles.clear}>
        Clear Filter
      </Text>

      {filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item._id}
          renderItem={renderExpenseItem}
          style={styles.expenseList}
        />
      ) : (
        <View style={styles.view}>
          <Text style={styles.text}>No Expenses Found</Text>
        </View>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("Add")}
        color="white"
      />

      <FAB
        style={styles.logout}
        icon="logout"
        onPress={() => logout()}
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
  },
  input: {
    marginTop: 16,
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
  },
  expenseList: {
    marginTop: 20,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 6,
  },
  list: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#00cc99",
  },
  logout: {
    position: "absolute",
    margin: 16,
    right: 0,
    top: 0,
    backgroundColor: "#00cc99",
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  clear: {
    marginTop: 15,
    marginLeft: 5,
    color: "#00cc99",
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 30,
    gap: 20,
    marginHorizontal: 30,
  },
});

export default HomeScreen;
