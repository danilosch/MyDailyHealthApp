import React, { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useHealthConnectData from "../hooks/useHealthConnectData";
import { Appbar, Card, FAB } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function Home() {
  const { caloriesBurned, insertActivity, height, weight } =
    useHealthConnectData();

  const [showModal, setShowModal] = useState(false);
  const [calories, setCalories] = useState("");
  const [startDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddPress = () => setShowModal(true);

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setEndDate(currentDate);
  };

  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || startDate;
    setShowTimePicker(false);
    setEndDate(currentDate);
  };

  const resetValues = () => {
    setCalories("");
    setEndDate(new Date());
  };

  const handleSave = () => {
    insertActivity({
      calories: Number(calories),
      startTime: new Date(startDate),
    });
    setShowModal(false);
    resetValues();
  };

  const handleCancel = () => {
    setShowModal(false);
    resetValues();
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTextCalories}>
        🔥 {Math.round(item.energy.inKilocalories)} KCal
      </Text>
      <Text style={styles.cardTextDateTime}>
        {new Date(item.startTime).toLocaleString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Image source={require("../../assets/icon.png")} style={styles.icon} />
        <Appbar.Content title="MyDailyHealth" />
      </Appbar.Header>

      <View style={styles.addButtonContainer}>
        <FAB
          icon="plus"
          color="#fff"
          style={styles.fab}
          onPress={handleAddPress}
        />
      </View>

      <View style={styles.containerBodyMeasurements}>
        <Card style={styles.cardBodyMeasurements}>
          <Text style={styles.textBodyMeasurements}>
            Peso: {weight.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            Kg
          </Text>
        </Card>
        <Card style={styles.cardBodyMeasurements}>
          <Text style={styles.textBodyMeasurements}>
            Altura:{" "}
            {height.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}M
          </Text>
        </Card>
      </View>

      <Card style={styles.listContainer}>
        <FlatList
          data={caloriesBurned?.records}
          keyExtractor={(item) => item.metadata?.id || "1"}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </Card>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar atividade</Text>

            <TextInput
              style={styles.input}
              placeholder="Calorias"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />

            <Button
              title={startDate.toLocaleDateString() || "Data Início"}
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <Button
              title={
                `${startDate.getHours().toString().padStart(2, "0")}:${startDate
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}` || "Hora Início"
              }
              onPress={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                maximumDate={new Date()}
                onChange={handleTimeChange}
              />
            )}

            <Button title="Salvar" onPress={handleSave} />
            <Button title="Cancelar" onPress={handleCancel} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  icon: {
    width: 42,
    height: 42,
    marginRight: 4,
  },
  addButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  fab: {
    backgroundColor: "#03a9f4",
  },
  containerBodyMeasurements: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    marginHorizontal: 16,
    gap: 6,
  },
  cardBodyMeasurements: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  textBodyMeasurements: {
    fontSize: 14,
    fontFamily: "regular",
  },
  listContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 16,
    padding: 4,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#d6d6d6",
  },
  cardTextCalories: {
    fontSize: 14,
    fontFamily: "regular",
  },
  cardTextDateTime: {
    fontSize: 14,
    fontFamily: "light",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    gap: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
