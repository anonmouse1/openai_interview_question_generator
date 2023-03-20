# OpenAI API - Node.js based Interview Question Generator App

This is an interview question generator app adapted from the OpenAI API [quickstart tutorial](https://beta.openai.com/docs/quickstart). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/).I've added in storage using Google firestore so that the API is not queried for every new user submission to keep costs low and improve speed.

Live site: www.generateinterviewquestions.com

<img width="616" alt="interviewQGenerator" src="https://user-images.githubusercontent.com/90865869/226148907-69374f14-a99c-480e-a137-697bceb14d0b.png">

If you like what you see and want to re-create /improve this site, feel free to clone/fork this repo and follow the instructions below to get up and running ! Issues/Pull requests are welcome.

The site could quiet readily be adapted for other specific use cases by changing the API prompt in the generate.js file.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd open-ai-interview-question-generator
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   ```bash
   $ cp .env.example .env
   ```

6. Add your [API key](https://beta.openai.com/account/api-keys) to the newly created `.env` file(eg.use nano or edit in an IDE)

7. Create a Firestore project and a firebase database and copy the credentials from the Firebase console into const firebaseConfig in index.js(https://firebase.google.com/docs/firestore/quickstart)(see "AddFirebase to your web app" from the project dashboard). The firebase collection should be called "questions" and the document should be called "questions" also.There are three fields in the firebase document questions: "date" type = timestamp, "jobTitle" type = strign and "questions" type = array.

8. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)
