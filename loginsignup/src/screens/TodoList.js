/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Frontend for the To Do List.
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/todo.png';
import pattern from '../../assets/pattern.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TodoList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [token, setToken] = useState('');
  const [errormsg, setErrormsg] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Function for retrieving tasks
  const fetchTasks = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.80.4.173:3000/tasks', {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setErrormsg('Failed to fetch tasks');
    }
  };

  // Function to add a new task
  const addTask = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.80.4.173:3000/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, assignedTo }),
      });
      const data = await response.json();
      setTasks([...tasks, data.task]);
      setTask('');
      setAssignedTo('');
    } catch (error) {
      console.error('Error adding task:', error);
      setErrormsg('Failed to add task');
    }
  };

  // Function for editing a task
  const editTask = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const response = await fetch(
        `http://10.80.4.173:3000/tasks/${editTaskId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${savedToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task, assignedTo }),
        }
      );
      const data = await response.json();
      setTasks(tasks.map((t) => (t._id === editTaskId ? data.task : t)));
      setTask('');
      setAssignedTo('');
      setEditMode(false);
      setEditTaskId(null);
    } catch (error) {
      console.error('Error editing task:', error);
      setErrormsg('Failed to edit task');
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      await fetch(`http://10.80.4.173:3000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrormsg('Failed to delete task');
    }
  };

  // Function to log out the user
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('login'); 
    } catch (error) {
      console.error('Error logging out:', error);
      setErrormsg('Failed to log out');
    }
  };

  // Effect when the component starts to load the token and retrieve tasks
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken); 
          fetchTasks(); 
        } else {
          console.error('No token found.');
          setErrormsg('No token found');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        setErrormsg('Failed to get token');
      }
    };

    fetchToken();
  }, []); 

  return (
    <View style={styles.container}>
      <Image source={pattern} style={styles.patternbg} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={{ color: 'white' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {errormsg && <Text style={styles.error}>{errormsg}</Text>}
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.task}</Text>
            <Text style={styles.assignedTo}>Assigned to: {item.assignedTo.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setTask(item.task);
                  setAssignedTo(item.assignedTo._id);
                  setEditMode(true);
                  setEditTaskId(item._id);
                }}
              >
                <Text style={{ color: 'white' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item._id)}
              >
                <Text style={{ color: 'white' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Task"
          value={task}
          onChangeText={setTask}
        />
        <TextInput
          style={styles.input}
          placeholder="Assigned To"
          value={assignedTo}
          onChangeText={setAssignedTo}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editMode ? editTask : addTask}
        >
          <Text style={{ color: 'white' }}>{editMode ? 'Save Changes' : 'Add Task'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: '100%',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
  patternbg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    zIndex: -1,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  taskText: {
    fontSize: 18,
  },
  assignedTo: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#F50057',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },
  addButton: {
    backgroundColor: '#F50057',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
  },
  logoutButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  error: {

    color: 'red',
    marginBottom: 10,

    textAlign: 'center',
  },
});
