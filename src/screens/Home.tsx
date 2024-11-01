import React from "react";
import { Text, View } from "react-native";
import useHealthConnectData from "../hooks/useHealthConnectData";

export default function Home() {
  const { height, weight } = useHealthConnectData();

  return (
    <View>
      <Text>Peso: {weight}Kg</Text>
      <Text>Altura: {height}M</Text>
    </View>
  );
}
