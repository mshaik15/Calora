# Calora
## Python Nutritional Calculator
Simple project made by Rehan, Jeremiah, and Zayn (Currently Prototype)

## Introduction

This project is a nutritional calculator that tracks calories and other nutrients in meals using a graphical user interface (GUI). The frontend is built with tkinter for a user-friendly experience, while the backend uses requests to fetch nutritional data via an API (Edamam). The user inputs meal data, and the application displays total calories and nutrients in the meal. It also shows a pie chart representing the ratio of calories consumed versus a target goal. The data is dynamically updated with every meal entry.

This project uses the `requests` library to access an API by `Edamam` $[1]$, More information is available at https://developer.edamam.com/edamam-nutrition-api, Please refer to this link to set up your own API required for this project.

 This project was created by Mohammed Rehan, Zayn, and Jeremiah using `pandas`, `matplotlib`, and `Tkinter` to prototype a frontend.

 # Logic.py

This file contains the backend logic for interacting with the Edamam API, calculating the total calories, and storing the nutritional data in a pandas DataFrame. It has a class `Logic` that handles data initialization, fetching nutrition information, adding meals, and resetting stored data.

# UI_P1.py
This file contains a prototype for the front end.

### References

[1] Edamam, "Edamam Nutrition API," [Online]. Available: https://developer.edamam.com/edamam-nutrition-api. [Accessed: Nov. 21, 2024].

### Reference Usage
- Sections containing concepts or ideas from external sources have been given reference at the section title
- Lines copied and pasted from external sources have been given in-text citation at the end of the respective sentence
