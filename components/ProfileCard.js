import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export const ProfileCard = ({ name, title, avatar }) => {
  return (
    <View style={styles.card}>
      <Image
        source={typeof avatar === "string" ? { uri: avatar } : avatar}
        style={styles.avatar}
      />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 300,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a2e",
  },

  titleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});