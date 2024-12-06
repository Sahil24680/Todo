import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, Alert, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Welcome from "./welcome"; // Adjust the path if necessary


import "../global.css";

export default function App() {
  const [inputValue, setInputValue] = useState(""); // this is for the input field to add toods to the array below
  const [todos, setTodos] = useState([]); // an array to hold and add the todos

  // gets all the sotred data in te async sotrage when u open the app orginally
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {// if theres todos data
          setTodos(JSON.parse(storedTodos)); // Load todos into the todos array by converting jason string to a todo Object.
        }
      } catch (error) {
        Alert.alert("Error loading todos", error.message);
      }
    };

    loadTodos();// used to call the fucntion
  }, []);

  // Save todos to AsyncStorage whenever theres a change in the todos array.
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(todos)); // Save todos to AsyncStorage
      } catch (error) {
        Alert.alert("Error saving todos", error.message);
      }
    };

    saveTodos();
  }, [todos]); //This tells useeffect wt to look at for changes

  const addTodo = (inputValue) => {
    if (!inputValue.trim()) {// checks if input is empty
      return; 
    }
    const newTodo = {
      id: Math.random().toString(36).slice(2, 11), // create random id
      text: inputValue.trim(),// gets rid of all spaces
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };
  const deleteTodo = (id_to_delete) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id_to_delete);
    setTodos(updatedTodos); // Update state with the filtered array
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
            <Welcome />
      <TextInput
      
        className="w-3/4 p-4 border border-gray-300 rounded-lg bg-gray-100" //tailwind css
        placeholder="Enter a task..." // Placeholder text
        value={inputValue} // Value linked to state
        onChangeText={(input) => setInputValue(input)}
        onSubmitEditing={() => addTodo(inputValue)} // when enter or return is pressed it will add wtv is in ur current input box if its not empty
      />
      {/* the slice() creates a copy of the array and the revesre() reverses that array and map() loops through the reversed array */}
      {todos.slice().reverse().map((todo,index ) => (//this is used to loop through all the tasks in todos array
            <View
              className="w-3/4 flex flex-row justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-100 mb-2"
              key={todo.id}
            >
              <Text className="text-lg text-gray-700">{todo.text}</Text>

              {/* The delete Button */}
              <Pressable
                onPress={() => deleteTodo(todo.id)}
                className="bg-red-500 px-2 py-1 rounded-md"
              >
                <Text className="text-white font-bold">Delete</Text>
              </Pressable>
            </View>
          )
        )}
    </View>
  );
}
