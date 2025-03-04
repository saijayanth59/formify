import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt, generationConfig } from "./utils/aiUtils";
import "./App.css";

const apiKey = "AIzaSyAkSmvQGTAMQblIWJPT0ufPzr7vFLgmJog";
const genAI = new GoogleGenerativeAI(apiKey);

async function getResponse(form) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    generationConfig,
  });
  const result = await model.generateContent([prompt, form]);
  return JSON.parse(result.response.text());
}

function App() {
  const [isGoogleForm, setIsGoogleForm] = useState(true);
  const [selector, setSelector] = useState("");

  useEffect(() => {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      const listener = async (message, sender, sendResponse) => {
        if (message.action === "fetchAIResponse") {
          if (message.formData) {
            const data = await getResponse(message.formData);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "insertData",
                data,
              });
            });
            console.log(data);
          }
        } else if (message.action === "dataInserted") {
          console.log("Data Inserted Successfully");
        } else {
          console.log("No form found on this page");
        }
      };
      chrome.runtime.onMessage.addListener(listener);
      return () => {
        chrome.runtime.onMessage.removeListener(listener);
      };
    } else {
      console.error("Chrome runtime is not available.");
    }
  }, []);

  function handleClick() {
    console.log("isGoogleForm:", isGoogleForm);
    console.log("selector:", selector);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "fetchFormData",
        isGoogleForm,
        selector,
      });
    });
  }

  return (
    <>
      <h1>👋 motherfucker, Are you ready to ✂️📝!!</h1>

      <div className="form-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isGoogleForm}
            onChange={() => setIsGoogleForm(!isGoogleForm)}
            className="form-checkbox"
          />
          <span className="checkbox-text">It's Google Form</span>
        </label>

        <div className={`input-group ${isGoogleForm ? "hidden" : "visible"}`}>
          <label className="input-label">
            Enter class or ID for questions/options:
          </label>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="e.g. .jay or #jay"
            className="form-input"
          />
        </div>

        <button className="submit-button" onClick={handleClick}>
          Get Answers
        </button>
      </div>
    </>
  );
}

export default App;
