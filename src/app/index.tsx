import { useRouter } from "expo-router";
import { Atom, CircleFadingPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [option, setOption] = React.useState("Today");
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetchHabits();
  }, [option]);

  const fetchHabits = async () => {
    const date = new Date();
    const day = date.getDay();
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_URL_ENDPOINT}/habits/${days[day]}`
      );
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const toggleHabitCompletion = async (habit) => {
    // Optimistically update the UI
    setHabits(
      habits.map((h) =>
        h._id === habit._id ? { ...h, isComplete: !h.isComplete } : h
      )
    );

    try {
      await fetch(`${process.env.EXPO_PUBLIC_URL_ENDPOINT}/habits/${habit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isComplete: !habit.isComplete,
        }),
      });
    } catch (error) {
      console.error("Error updating habit:", error);
      // Revert the optimistic update if the API call fails
      setHabits(habits);
    }
  };

  const deleteHabit = async (habitId) => {
    // Optimistically update the UI
    setHabits(habits.filter((h) => h._id !== habitId));

    try {
      await fetch(`${process.env.EXPO_PUBLIC_URL_ENDPOINT}/habits/${habitId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting habit:", error);
      // Revert the optimistic update if the API call fails
      fetchHabits();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Atom size={28} color={"black"} />
          <Text style={styles.title}>Atomic Habits</Text>
        </View>
        <CircleFadingPlus
          size={28}
          color={"black"}
          onPress={() => {
            router.push("/create");
          }}
        />
      </View>
      <View style={styles.optionsContainer}>
        {["Today", "Weekly", "Overall"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setOption(item)}
            style={[
              styles.optionButton,
              option === item && styles.selectedOptionButton,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                option === item && styles.selectedOptionText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="px-1 min-h-screen">
        {habits.map((habit) => (
          <Pressable
            key={habit._id}
            className={`bg-gray-100 p-2 my-2 px-4 rounded-lg ${
              habit.isComplete ? "bg-gray-900 text-white" : ""
            }`}
            onPress={() => toggleHabitCompletion(habit)}
            onLongPress={() =>
              Alert.alert(
                "Delete Habit",
                "Are you sure you want to delete this habit?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => deleteHabit(habit._id),
                  },
                ]
              )
            }
          >
            <Text
              className={`p-2 px-4 ${habit.isComplete ? "text-white" : ""}`}
            >
              {habit.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "baseline",
  },
  title: {
    fontSize: 23,
    paddingLeft: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
  },
  selectedOptionButton: {
    backgroundColor: "#E0FFFF",
  },
  optionText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "black",
  },
});
