import React, { useState, useEffect,View } from "react";
import { Text } from "react-native";




const Welcome = () => {
    const [displayedText, setDisplayedText] = useState(""); //used to print char by char
    const text = "Welcome to my Todo App"; // msg to print out 
    const typingSpeed = 150; // time in between each print
    
    useEffect(() => {
        let charIndex = 0; // index tracker for the string
        const intervalId = setInterval(() => { // a JS fucntion that repateadly calls itself at a given speed(typingspeed).
          if (charIndex < text.length) {//checks if the entirr string ahs been printed 
            setDisplayedText(text.slice(0, charIndex + 1)); // Updates displayed text
            charIndex++; // Move to the next character
          } else {
            clearInterval(intervalId); // Stop interval when all characters are displayed
          }
        }, typingSpeed);// the speed in which it calls it self again
      
        return () => clearInterval(intervalId); //optinoal but good practice.
      }, []);
    










  
  
  
  
    return (
        <Text style={{ fontSize: 24, fontWeight: 'RobotoItalic', marginBottom: 20 }}>
          {displayedText}
        </Text>
      );
    
}

export default Welcome

