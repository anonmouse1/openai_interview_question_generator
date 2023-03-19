import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import LoadingSpinner from "./LoadingSpinnner";
//import firebase from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";

export default function Home() {
  const [jobInput, setJobInput] = useState("");
  const [result, setResult] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [searchFrequency, setSearchFrequency] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setIsFirst] = useState("");
  let matchedJob = false;

  // Firebase configuration
  //see readme for how to obtain your own firebase details
  const firebaseConfig = {
    apiKey: "paste-firebase-apiKey-Here",

    authDomain: "paste-firebase-authDomain-Here",

    projectId: "paste-firebase-projectId-Here",

    storageBucket: "paste-firebase-storageBucket-Here",

    messagingSenderId: "paste-firebase-messagingSenderId-Here",

    appId: "paste-firebase-appId-Here",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function onSubmit(event) {
    // check jobinput for empty string and return if empty
    if (jobInput === "") {
      setIsLoading(false);
      alert("Please enter a job title");
      return;
    }
    //check jobInput for list of banned keywords to avoid basic OpenAI API prompt injection attacks
    const bannedKeywords = [
      "ignore",
      "previous",
      "instead",
      "instead of",
      "rather than",
      "do this",
      "prompt",
    ];
    for (let i = 0; i < bannedKeywords.length; i++) {
      if (jobInput.toLowerCase().includes(bannedKeywords[i])) {
        setIsLoading(false);
        alert(
          "The job title is invalid. Try removing the word " + bannedKeywords[i]
        );
        return;
      }
    }
    event.preventDefault();
    setIsLoading(true);
    setJobTitle("");
    setIsFirst("");
    const currentDB = getJobTitles(db);
    let jobArray = [];
    (await currentDB).forEach((doc) => {
      jobArray.push(doc);
    });
    const arrayMatchCounter = 0;
    const jobArraySize = jobArray.length;

    //check each element in the database for a match against the job input
    for (let i = 0; i < jobArraySize; i++) {
      arrayMatchCounter += 1;
      if (jobArray[i].jobTitle === jobInput) {
        setJobTitle("Job Title: " + jobArray[i].jobTitle);
        setResult(jobArray[i].questions);
        setIsLoading(false);
        matchedJob = true;
        setJobInput("");
        /*
        //update the search frequency
        const docId = jobArray[i].id;
        const searchFreqRef = db.collection("questions").doc(docId);
        // update the search frequency for the job title
        const searchFrequency = jobArray[i].searchFrequency;
        const updateSearchFreq = await searchFreqRef.update({
          searchFrequency: searchFrequency + 1,
        });
        */
      }
    }
    //if no match was found in the whole database then call the api to get a new set of questions

    if (!matchedJob && arrayMatchCounter === jobArraySize) {
      //console.log("Calling the api");
      setIsFirst("🥇 You're the first to use this job title! 🥇");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job: jobInput }),
      });
      const data = await response.json();
      if (data) {
        setIsLoading(false);
      }
      var dataArray = data.result.split("\n");
      var cleanedArray = dataArray.filter(function (item) {
        return item != "";
      });
      // remove duplicates from cleanedArray
      var uniqueArray = cleanedArray.filter(function (item, pos) {
        return cleanedArray.indexOf(item) == pos;
      });

      setResult(uniqueArray);
      setJobInput("");
      setJobTitle(`Job Title: ${jobInput}`);
      saveSearch(jobInput, uniqueArray);
    }
  }

  // Get a list of jobTitles from database
  async function getJobTitles(db) {
    const jobCol = collection(db, "questions");
    const jobSnapshot = await getDocs(jobCol);
    const jobList = jobSnapshot.docs.map((doc) => doc.data());
    return jobList;
  }

  // Saves a new search to Cloud Firestore.
  async function saveSearch(jobInput, result) {
    // Add a new search entry to the Firebase database.
    try {
      await addDoc(collection(getFirestore(), "questions"), {
        date: new Date(),
        jobTitle: jobInput,
        questions: result,
        //searchFrequency: 1,
      });
    } catch (error) {
      console.error("Error writing new message to Firebase Database", error);
    }
  }

  return (
    <div>
      <Head>
        <title>Generate Interview Questions</title>
        <link rel="icon" href="/interview-panel.png" />
      </Head>

      <main className={styles.main}>
        <img src="/interview-panel.png" className={styles.icon} />
        <h3>Interview Questions for every job</h3>
        <img
          src="https://cdn.openai.com/API/logo-assets/powered-by-openai.svg"
          alt="Powered by OpenAI"
          className="poweredByOpenAi"
          width={110}
        ></img>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="job"
            placeholder="Enter a job title"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
          />
          <input type="submit" value="Generate interview questions" />
        </form>
        <h2>{jobTitle}</h2>
        <div className="styles.result">
          {isLoading && matchedJob ? (
            <LoadingSpinner />
          ) : isLoading && !matchedJob ? (
            <div>
              <LoadingSpinner /> <p>{isFirst}</p>
            </div>
          ) : (
            <ul>
              {result.map((jobName) => (
                <li key={Math.random()}>{jobName}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
