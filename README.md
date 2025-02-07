# Trivial Expo Project

Welcome to the Trivial Expo App, a modern, cross-platform application built using Expo and React Native. This project leverages Expo Router for file-based routing and includes a Python utility for converting question data from CSV to JSON format.

## About Trivial
Trivial is envisioned as a simple yet powerful trivia game that challenges your knowledge across multiple topics. Powered by dynamic question management and a flexible architecture, it serves as a foundation for engaging quiz experiences. Use the provided CSV-to-JSON conversion script to easily populate the app with new trivia content.

## Features

- Cross-platform support for Android, iOS, and Web
- File-based routing with Expo Router
- Integrated Python script for CSV-to-JSON conversion (located in convert_questions.py)
- Modern React Native UI components and Expo ecosystem tools

## Prerequisites

- Node.js and npm
- Python (for running the conversion script)
- Expo CLI (`npm install -g expo-cli`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd trivial
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

   To run on a specific platform:
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`

## Data Conversion Utility

Use the `convert_questions.py` script to convert CSV files into JSON format for use in the app. The script expects a CSV file located at `data/questions.csv` and outputs a JSON file to `data/realquestions.json`.
   
To run the conversion:
   ```bash
   python convert_questions.py
   ```

## Project Structure

- `app/` - Contains the application source code and page components.
- `assets/` - Static assets like images and fonts.
- `data/` - Data files including CSV and JSON.
- `scripts/` - Project scripts (e.g., reset-project).
- `convert_questions.py` - Python script for CSV to JSON conversion.
- `package.json` - Project configuration and dependencies.

## Resetting the Project

If you want to start fresh, you can run:
   ```bash
   npm run reset-project
   ```

## Contributing

Contributions are welcome! Please fork the repository and send a pull request with your changes. For major changes, open an issue first to discuss what you would like to change.

## Future Releases
In the future, ready-to-install APK files of this app will be made available on the Releases page of this repository. Stay tuned for updates as we continue to enhance the app.

## License

This project is licensed under the MIT License.
