import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const SeatSelector = ({ fare = 1000 }) => {
  const [seats, setSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const increaseSeats = () => {
    if (seats < 5) {
      setSeats(seats + 1);
    }
  };

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1);
    }
  };

  const totalFare = fare * seats;

  const confirmBooking = () => {
    Alert.alert(
      "Booking Confirmed",
      `Your ride has been booked successfully.\n\nSeats: ${seats}\nTotal: ₦${totalFare.toLocaleString()}\nPayment: ${paymentMethod}`,
      [
        {
          text: "OK",
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Ride</Text>
        <Text style={styles.headerSubtitle}>
          Confirm your ride details
        </Text>
      </View>

      {/* DRIVER INFORMATION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Driver Information</Text>

        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>

          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ahmed Musa</Text>
            <Text style={styles.driverCar}>Toyota Corolla</Text>
            <Text style={styles.rating}>★ 4.8 • 32 trips</Text>
          </View>

          <Text style={styles.price}>
            ₦{fare.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ROUTE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ride Details</Text>

        <View style={styles.routeRow}>
          <View style={styles.dotGreen} />

          <View style={styles.locationContainer}>
            <Text style={styles.smallLabel}>PICKUP</Text>
            <Text style={styles.location}>
              University Gate
            </Text>
          </View>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.routeRow}>
          <View style={styles.dotRed} />

          <View style={styles.locationContainer}>
            <Text style={styles.smallLabel}>DESTINATION</Text>
            <Text style={styles.location}>
              City Mall
            </Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View>
            <Text style={styles.smallLabel}>DEPARTURE</Text>
            <Text style={styles.boldText}>8:00 AM</Text>
          </View>

          <View>
            <Text style={styles.smallLabel}>ARRIVAL</Text>
            <Text style={styles.boldText}>8:30 AM</Text>
          </View>

          <View>
            <Text style={styles.smallLabel}>DATE</Text>
            <Text style={styles.boldText}>Today</Text>
          </View>
        </View>
      </View>

      {/* SEAT SELECTOR */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Select Number of Seats
        </Text>

        <Text style={styles.description}>
          How many seats would you like to book?
        </Text>

        <View style={styles.counter}>
          <TouchableOpacity
            style={[
              styles.counterButton,
              seats === 1 && styles.disabledButton,
            ]}
            onPress={decreaseSeats}
            disabled={seats === 1}
          >
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>

          <View style={styles.numberContainer}>
            <Text style={styles.seatNumber}>{seats}</Text>
            <Text style={styles.seatLabel}>
              {seats === 1 ? "Seat" : "Seats"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.counterButton,
              seats === 5 && styles.disabledButton,
            ]}
            onPress={increaseSeats}
            disabled={seats === 5}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.available}>
          3 seats available
        </Text>
      </View>

      {/* FARE SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Fare Summary
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Fare per seat
          </Text>

          <Text style={styles.summaryValue}>
            ₦{fare.toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Number of seats
          </Text>

          <Text style={styles.summaryValue}>
            × {seats}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Service fee
          </Text>

          <Text style={styles.summaryValue}>
            ₦0
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>
            Total Fare
          </Text>

          <Text style={styles.total}>
            ₦{totalFare.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* PAYMENT METHOD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Payment Method
        </Text>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Cash" &&
              styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod("Cash")}
        >
          <View>
            <Text style={styles.paymentTitle}>
              Cash
            </Text>

            <Text style={styles.paymentSubtitle}>
              Pay the driver directly
            </Text>
          </View>

          <View
            style={[
              styles.radio,
              paymentMethod === "Cash" &&
                styles.radioSelected,
            ]}
          >
            {paymentMethod === "Cash" && (
              <View style={styles.radioDot} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Wallet" &&
              styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod("Wallet")}
        >
          <View>
            <Text style={styles.paymentTitle}>
              Wallet
            </Text>

            <Text style={styles.paymentSubtitle}>
              Pay using your Lincampride wallet
            </Text>
          </View>

          <View
            style={[
              styles.radio,
              paymentMethod === "Wallet" &&
                styles.radioSelected,
            ]}
          >
            {paymentMethod === "Wallet" && (
              <View style={styles.radioDot} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* CONFIRM BUTTON */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={confirmBooking}
      >
        <Text style={styles.confirmText}>
          Confirm Booking
        </Text>

        <Text style={styles.confirmPrice}>
          ₦{totalFare.toLocaleString()}
        </Text>
      </TouchableOpacity>

      <Text style={styles.notice}>
        By confirming, you agree to the ride booking
        terms and conditions.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    marginTop: 35,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1B5E20",
  },

  headerSubtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
  },

  description: {
    color: "#777",
    fontSize: 14,
    marginBottom: 20,
  },

  driverRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#1B5E20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },

  driverName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },

  driverCar: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },

  rating: {
    fontSize: 13,
    color: "#D89000",
    marginTop: 4,
  },

  price: {
    color: "#1B5E20",
    fontSize: 17,
    fontWeight: "bold",
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1B5E20",
    marginRight: 12,
  },

  dotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D32F2F",
    marginRight: 12,
  },

  locationContainer: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "bold",
    marginBottom: 3,
  },

  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  routeLine: {
    width: 2,
    height: 28,
    backgroundColor: "#ddd",
    marginLeft: 5,
    marginVertical: 3,
  },

  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 18,
    paddingTop: 15,
  },

  boldText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginTop: 4,
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  counterButton: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#1B5E20",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#A5C5A8",
  },

  counterText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },

  numberContainer: {
    width: 90,
    alignItems: "center",
  },

  seatNumber: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#222",
  },

  seatLabel: {
    fontSize: 13,
    color: "#777",
  },

  available: {
    textAlign: "center",
    marginTop: 15,
    color: "#1B5E20",
    fontWeight: "600",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#222",
  },

  total: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1B5E20",
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  selectedPayment: {
    borderColor: "#1B5E20",
    backgroundColor: "#F1F8F2",
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  paymentSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: "#1B5E20",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#1B5E20",
  },

  confirmButton: {
    backgroundColor: "#1B5E20",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  confirmText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  confirmPrice: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  notice: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 12,
    paddingHorizontal: 15,
  },
});

export default SeatSelector;