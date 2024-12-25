import React from "react";
import { Platform, KeyboardAvoidingView, ScrollView,Text, View, TextInput, Alert, Pressable } from "react-native";

const Todoloop = ({ todos, isEditMode, updateTodo, deleteTodo }) => {
  return (
    <>
       
       <ScrollView
          className="w-full mt-14" 
          contentContainerStyle={{
            alignItems: "center", 
            flexGrow: 1, 
            paddingBottom: 20, 
          }}
          keyboardShouldPersistTaps="handled" // Ensures taps work with keyboard open
        >
       {todos.sort((a, b) => a.id - b.id) .map((todo) =>(//loops through the todos in ascending order
        <View
          className="w-3/4 flex flex-row justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-100 mb-2"
          key={todo.id}
        >
          {(() => {
            if (isEditMode) { // to check if its currently in edit mode
              return (
                <Pressable>
                  <TextInput
                    placeholder={todo.tasks}
                    onSubmitEditing={(event) => {
                      const updatedTask = event.nativeEvent.text; // ectracts text entered by user
                      updateTodo(todo.id, updatedTask);
                    }}
                  />
                </Pressable>
              );
            } else {
              return <Text className="text-lg text-gray-700">{todo.tasks}</Text>;
            }
          })()}

          {/* The delete Button */}
          <Pressable
            onPress={() => deleteTodo(todo.id)}
            className="bg-red-500 px-2 py-1 rounded-md"
          >
            <Text className="text-white font-bold">Delete</Text>
          </Pressable>
        </View>
      ))}
      </ScrollView>
    </>
  );
};

export default Todoloop;
