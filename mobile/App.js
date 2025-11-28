import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
const QUEUE_KEY = "offline-report-queue";

const incidentOptions = ["shortage", "displacement", "crop_failure", "price_spike"];

const defaultForm = {
  reporter_name: "",
  reporter_role: "Field Officer",
  county: "",
  payam: "",
  incident_type: incidentOptions[0],
  households_impacted: "0",
  narrative: "",
};
const orderedFields = ["reporter_name", "reporter_role", "county", "payam", "households_impacted", "narrative"];

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [queue, setQueue] = useState([]);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
          }
        }
      } catch (error) {
        console.warn("Location permission error:", error);
      }
    })();
    loadQueue();
    fetchRisk();
  }, []);

  const fetchRisk = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/v1/vulnerability/unity`);
      setRisk(data);
    } catch (error) {
      console.warn("Failed to fetch risk", error);
    }
  };

  const loadQueue = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Failed to load queue:", error);
    }
  };

  const persistQueue = async (nextQueue) => {
    try {
      setQueue(nextQueue);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(nextQueue));
    } catch (error) {
      console.warn("Failed to persist queue:", error);
    }
  };

  const syncQueuedReports = async () => {
    const onlineQueue = [];
    for (const report of queue) {
      try {
        await axios.post(`${API_URL}/v1/reports`, report);
      } catch (error) {
        onlineQueue.push(report);
      }
    }
    persistQueue(onlineQueue);
    if (!onlineQueue.length) {
      Alert.alert("Synced", "All offline reports have been uploaded.");
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.reporter_name || !form.county) {
      Alert.alert("Missing info", "Reporter name and county are required.");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      households_impacted: Number(form.households_impacted ?? 0),
      location: {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        settlement: form.payam,
      },
      attachments: [],
    };
    try {
      await axios.post(`${API_URL}/v1/reports`, payload);
      Alert.alert("Submitted", "Report shared with coordination hub.");
      setForm(defaultForm);
    } catch (error) {
      Alert.alert(
        "Offline",
        "No connectivity detected. Report added to your offline queue and will auto-sync later."
      );
      const nextQueue = [...queue, payload];
      await persistQueue(nextQueue);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = queue.length;
  const formattedRiskScore = useMemo(() => risk?.risk_score?.toFixed(2) ?? "0.00", [risk]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <StatusBar style="dark" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ padding: 16 }}>
        <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#059669", textTransform: "uppercase" }}>
            Field Operations
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 4, color: "#0f172a" }}>
            Rapid Community Reporting
          </Text>
          <Text style={{ color: "#475569", marginTop: 8 }}>
            Capture shortages, displacement, or crop failure signals even while offline. Data syncs when connectivity
            returns.
          </Text>
          {risk ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 13, color: "#475569" }}>Unity County risk score</Text>
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#b91c1c" }}>{formattedRiskScore}</Text>
              <Text style={{ color: "#475569" }}>Status: {risk.risk_level}</Text>
            </View>
          ) : (
            <Text style={{ marginTop: 12, color: "#475569" }}>Fetching AI vulnerability insight…</Text>
          )}
        </View>

        <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 16, gap: 12 }}>
          <View>
            <Text style={{ fontSize: 12, textTransform: "uppercase", color: "#475569", marginBottom: 8 }}>
              Incident type
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {incidentOptions.map((option) => {
                const selected = form.incident_type === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleChange("incident_type", option)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: selected ? "#2563eb" : "#e2e8f0",
                    }}
                  >
                    <Text style={{ color: selected ? "#fff" : "#0f172a", fontWeight: "600" }}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {orderedFields.map((field) => (
            <View key={field}>
              <Text style={{ fontSize: 12, textTransform: "uppercase", color: "#475569", marginBottom: 4 }}>
                {field.replace("_", " ")}
              </Text>
              <TextInput
                value={form[field]}
                onChangeText={(value) => handleChange(field, value)}
                placeholder={`Enter ${field}`}
                keyboardType={field === "households_impacted" ? "numeric" : "default"}
                style={{
                  borderWidth: 1,
                  borderColor: "#cbd5f5",
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: "#fff",
                }}
                multiline={field === "narrative"}
                numberOfLines={field === "narrative" ? 3 : 1}
              />
            </View>
          ))}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#94a3b8" : "#2563eb",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{submitting ? "Saving…" : "Submit Report"}</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Offline Queue</Text>
          <Text style={{ color: "#475569", marginTop: 4 }}>{pendingCount} pending reports</Text>
          <Pressable
            onPress={syncQueuedReports}
            style={{
              marginTop: 12,
              borderWidth: 1,
              borderColor: "#0f172a",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: "#0f172a" }}>Sync now</Text>
          </Pressable>
        </View>

        <Text style={{ textAlign: "center", marginTop: 16, color: "#94a3b8" }}>
          {Platform.OS === "ios" ? "Supports offline GPS capture" : "Optimized for low-end Android devices"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

