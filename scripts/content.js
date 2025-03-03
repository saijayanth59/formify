console.log("I am working");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchFormData") {
    let form = document.querySelector("form");

    if (form) {
      chrome.runtime.sendMessage({ formData: form.outerHTML });
    } else {
      chrome.runtime.sendMessage({ error: "No form found on this page" });
    }
  }
});
