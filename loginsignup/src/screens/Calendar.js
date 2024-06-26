/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Frontend for the Calendar Page.
  In this Code I needed help from AI
*/

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from 'react-native-vector-icons/MaterialIcons';
import logo from "../../assets/calendar.png";
import pattern from "../../assets/pattern.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CalendarScreen = () => {
  // State for managing events, selected date, modal visibility, new event title, current events, selected event, and errors
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null); // State to track the expanded event
  const [error, setError] = useState(null);

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch events from the server
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://10.80.4.173:3000/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const formattedEvents = {};
      data.forEach((event) => {
        const date = new Date(event.date).toISOString().split("T")[0];
        if (!formattedEvents[date]) {
          formattedEvents[date] = { marked: true, dots: [], events: [] };
        }
        formattedEvents[date].dots.push({
          key: event._id,
          color: "red",
          selectedDotColor: "blue",
        });
        formattedEvents[date].events.push(event);
      });
      setEvents(formattedEvents);
      console.log("Fetched events:", formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events");
    }
  };

  // Function to add a new event
  const addEvent = async () => {
    try {
      console.log("Adding event:", {
        title: newEventTitle,
        date: selectedDate,
      });
      const response = await fetch("http://10.80.4.173:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newEventTitle, date: selectedDate }),
      });
      if (!response.ok) {
        throw new Error("Failed to add event");
      }
      setNewEventTitle("");
      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event");
    }
  };

  // Function to update an existing event
  const updateEvent = async () => {
    try {
      console.log("Updating event:", selectedEvent);
      const response = await fetch(
        `http://10.80.4.173:3000/events/${selectedEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newEventTitle, date: selectedDate }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      setNewEventTitle("");
      setSelectedEvent(null);
      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event");
    }
  };

  // Function to delete an event
  const deleteEvent = async (eventId) => {
    try {
      console.log("Deleting event:", eventId);
      const response = await fetch(
        `http://10.80.4.173:3000/events/${eventId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  // Function to handle day press on the calendar
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const dayEvents = events[day.dateString]?.events || [];
    setCurrentEvents(dayEvents);
    setEventModalVisible(true);
    console.log("Selected date:", day.dateString);
  };

  // Function to handle event press
  const onEventPress = (event) => {
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setModalVisible(true);
  };

  // Function to handle saving an event (add or update)
  const handleSaveEvent = () => {
    if (selectedEvent) {
      updateEvent();
    } else {
      addEvent();
    }
  };

  // Function to handle expanding or collapsing event details
  const toggleExpandEvent = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <View style={styles.container}>
      <Image source={pattern} style={styles.patternbg} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...events,
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: "blue",
            },
          }}
          style={styles.calendar}
        />
        <Button
          title="Add Event"
          onPress={() => setModalVisible(true)}
          color="#FF69B4"
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setSelectedEvent(null);
          setNewEventTitle("");
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {selectedEvent ? "Edit Event" : "Add Event"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Event title"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />
          <Button
            title={selectedEvent ? "Update Event" : "Add Event"}
            onPress={handleSaveEvent}
            color="#FF69B4"
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              setModalVisible(!modalVisible);
              setSelectedEvent(null);
              setNewEventTitle("");
            }}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => {
          setEventModalVisible(!eventModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Events on {selectedDate}</Text>
          <FlatList
            data={currentEvents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <TouchableOpacity
                  style={styles.eventTitle}
                  onPress={() => toggleExpandEvent(item._id)}
                >
                  <Text>{item.title}</Text>
                </TouchableOpacity>
                {expandedEventId === item._id && (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onEventPress(item)}
                    >
                      <Icon name="edit" size={20} color="#FF69B4" />
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteEvent(item._id)}
                    >
                      <Icon name="delete" size={20} color="#FF69B4" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setEventModalVisible(!eventModalVisible)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.2,
    resizeMode: "contain",
  },
  patternbg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    zIndex: -1,
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  calendar: {
    width: windowWidth * 0.9,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  eventItem: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 18,
  },
  buttonGroup: {
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: "#FF69B4",
  },
});

export default CalendarScreen;
