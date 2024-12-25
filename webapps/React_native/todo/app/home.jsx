import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import Welcome from "./welcome";
import "../global.css";
import Todoloop from "./todo_loop";
import { Stack, useSearchParams } from "expo-router";
import supabase from "./supabaseClient";

let current_user_id;
export default function App() {
  const [inputValue, setInputValue] = useState(""); // this is for the input field to add toods to the array below
  const [todos, setTodos] = useState([]); // an array to hold and add the todos
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    get_data_from_table(); // calls this fucntion as soon as a user has logged in.
  }, [currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("fetch was called"); // for debugging
      const { data, error } = await supabase.auth.getUser(); // gets current user

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (data?.user) {
        current_user_id = data.user.id;
        setCurrentUser(data.user); // sets user state to the user
      } else {
        console.log("No user found.");
      }
    };

    fetchUser();
  }, []); // this runs when app first opens

  async function get_data_from_table() {
    //this fucntion gets data from datatable when app first laods
    console.log("data called"); // for debugging
    const { data } = await supabase
      .from("todo_table")
      .select()
      .eq("user_id", current_user_id); //gets all the data for the logged in user
    if (data) {
      console.log("Fetched data:", data);
    } else {
      console.error("Error fetching todos:", error.message);
    }

    console.log("setTodos called with:", data);
    setTodos(data); // sets the data into the todos array
  }
  // this fucntion gets the data from database
  async function getCountries() {
    const { data } = await supabase
      .from("todo_table")
      .select()
      .eq("user_id", current_user_id); ////gets all the data for the logged in user after a todo was added
    if (data) {
      console.log("Fetched data:", data);
    }

    console.log("setTodos called with:", data);
    setTodos(data); // sets the data into the todos array
  }

  const updateTodo = async (id, task) => {
    // this funtion updates task based on the id passed through
    const trimmedTask = task.trim();
    if (trimmedTask === "") {
      console.log("Task is empty, so no change");
      toggleEditMode();
      return; // Does not update if the task is empty
    }

    const { error } = await supabase // this part updates the todo by searching the todo_table foe the id of passed through and the new task.
      .from("todo_table")
      .update({ tasks: task })
      .eq("id", id);
    getCountries(); // re renders allof the suers data from data table
  };
  const toggleEditMode = () => {
    // this fucntion determines wether you can edit the todos
    setIsEditMode((prevState) => {
      const newState = !prevState; // Toggle the state
      if (!prevState) {
        console.log("Edit mode on");
      } else {
        console.log("Edit mode off");
      }
      return newState; // Return the updated state
    });
  };

  const addTodo = async (inputValue) => {
    //this fucntion adds todos
    if (!inputValue.trim()) {
      // checks if input is empty
      return;
    }
    // Insert the task into the database
    const { data, error } = await supabase
      .from("todo_table")
      .insert([{ tasks: inputValue, user_id: current_user_id }]); //creates a todo

    if (error) {
      console.error("Error inserting task:", error.message);
      Alert.alert("Error", "Failed to add task to the database.");
      return;
    }

    setInputValue(""); // to clear input field after
    getCountries(); // to re render all the todos into the aray after an addation was made to the database.
  };
  const deleteTodo = async (id_to_delete) => {
    // this fucntion deletes todos
    const response = await supabase
      .from("todo_table")
      .delete()
      .eq("id", id_to_delete);

    const updatedTodos = todos.filter((todo) => todo.id !== id_to_delete);
    setTodos(updatedTodos); // Update state with the filtered array
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut(); //logs user out
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen name="screenName" options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjustment based on platform
        className="flex-1 bg-white"
      >
        <View className="flex-1 justify-center items-center bg-white">
          <Pressable
            onPress={() => toggleEditMode()}
            className="absolute top-5 left-5 border border-blue-500 text-blue-500 bg-white px-5 py-2 rounded-md shadow-sm hover:bg-blue-500 hover:text-white transition-transform duration-200 transform translate-x-[300px] -translate-y-[-50px]"
          >
            <Text className="font-medium text-sm">Edit</Text>
          </Pressable>

          <Pressable
            onPress={() => logout()} // Call your logout function
            className="absolute top-5 left-5 border border-red-500 text-red-500 bg-white px-5 py-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white transition-transform duration-200  translate-x-[0px] -translate-y-[-50px]"
          >
            <Text className="font-medium text-sm">Logout</Text>
          </Pressable>

          <View style={{ marginTop: 200 }}>
            <Welcome />
          </View>

          <TextInput
            className="w-3/4 p-4 border border-gray-300 rounded-lg bg-gray-100 " // tailwind css
            placeholder="Enter a task..." // Placeholder text
            value={inputValue} // Value linked to state
            onChangeText={(input) => setInputValue(input)}
            onSubmitEditing={() => addTodo(inputValue)} // when enter or return is pressed it will add wtv is in ur current input box if its not empty
          />

          {/* This custom tag takes care of rendering all the todos, updating todos and deleting them.*/}
          <Todoloop
            todos={todos} // Passes the todos array
            isEditMode={isEditMode} // Passes edit mode state
            updateTodo={updateTodo} // Passes update todo fucntion
            deleteTodo={deleteTodo} // Passes deletetodo function
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
