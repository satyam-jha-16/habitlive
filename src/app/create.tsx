import { CircleChevronLeft, NotebookPen } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const create = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [repeatDays, setRepeatDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });

  const days = [
    { key: "mon", label: "Monday" },
    { key: "tue", label: "Tuesday" },
    { key: "wed", label: "Wednesday" },
    { key: "thu", label: "Thursday" },
    { key: "fri", label: "Friday" },
    { key: "sat", label: "Saturday" },
    { key: "sun", label: "Sunday" },
  ];

  const handleDayToggle = (day: string) => {
    setRepeatDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  const handleSubmit = async () => {
    if (!title) return alert("Please enter a title");
    // console.log({ title, repeatDays });
    if (!Object.values(repeatDays).some((day) => day))
      return alert("Please select at least one day");
    setLoading(true);
    try {
      const input = { title, repeatDays };
      // const ressponse = fetch("http://localhost:5000/")
      const res = await fetch(`${process.env.EXPO_PUBLIC_URL_ENDPOINT}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        alert("Habit created successfully");
        setTitle("");
        setRepeatDays({
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false,
        });
      } else {
        alert("An error occurred");
      }
    } catch (e) {
      return alert("An error occurred");
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="pt-14 p-30 px-4 bg-white">
      <View className="flex flex-row align-baseline gap-4">
        <CircleChevronLeft size={27} color={"black"} />
        <Text className="text-[23px] shadow-xl shadow-gray-900">
          Create Habit{" "}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <NotebookPen size={22} style={styles.icon} />
        <TextInput
          placeholder="Task"
          placeholderTextColor="#737373"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      <Text style={{ fontSize: 20, fontWeight: "400", marginTop: 10 }}>
        Repeat
      </Text>
      <View className="flex flex-col gap-2">
        {days.map((day) => (
          <View key={day.key} className="flex flex-row py-2">
            <BouncyCheckbox
              size={25}
              fillColor="#171717"
              unFillColor="#ffffff"
              iconStyle={{ borderColor: "#171717" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ textDecorationLine: "none" }}
              onPress={() => handleDayToggle(day.key)}
              isChecked={repeatDays[day.key]}
            />
            <Text>{day.label}</Text>
          </View>
        ))}
      </View>
      <View className="relative w-full mt-4">
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-row items-center justify-center w-full h-12 py-2 rounded-lg bg-neutral-800"
        >
          {loading ? (
            <ActivityIndicator size={16} color="#fff" />
          ) : (
            <Text className="text-white font-medium">Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default create;
const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    width: "100%",
    marginTop: 16,
  },
  input: {
    width: "100%",
    height: 48,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  icon: {
    position: "absolute",
    top: 12,
    left: 10,
    color: "#737373",
  },
});
