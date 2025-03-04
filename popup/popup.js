import { GoogleGenerativeAI } from "./google.js";
import { prompt, generationConfig } from "./utils.js";
console.log("POPUP SCRIPT LOADED");

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

document.getElementById("fetchData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "fetchFormData" });
  });
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "fetchAIResponse") {
    if (message.formData) {
      const data = await getResponse(message.formData);
      //   console.log("Form Data Received in Popup:", message.formData);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "insertData", data });
      });
      console.log(data);
    }
  } else if (message.action === "dataInserted") {
    console.log("Data Inserted Successfully");
  } else {
    console.log("No form found on this page");
  }
});
