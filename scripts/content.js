console.log("I am working");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchFormData") {
    let form = document.querySelector("form");

    if (form) {
      chrome.runtime.sendMessage({
        formData: form.outerHTML,
        action: "fetchAIResponse",
      });
    } else {
      chrome.runtime.sendMessage({ error: "No form found on this page" });
    }
  } else if (message.action === "insertData") {
    console.log("Inserting data", message.data);
    insertAnswers(message.data);
    chrome.runtime.sendMessage({ action: "dataInserted" });
  }
});

function insertAnswers(data) {
  data.forEach(({ question, answer, confidence, identifier }) => {
    let targetElement = null;

    if (!targetElement) {
      document.querySelectorAll("p, span, div, label").forEach((el) => {
        if (
          el.childNodes.length === 1 &&
          el.textContent.trim().includes(question)
        ) {
          targetElement = el;
        }
      });
    }

    if (targetElement) {
      // Avoid duplicate buttons
      if (
        targetElement.nextSibling &&
        targetElement.nextSibling.className === "show-answer-btn"
      )
        return;

      // Create "Show Answer" button
      const button = document.createElement("button");
      button.textContent = "Show Answer";
      button.className = "show-answer-btn";
      button.style.marginLeft = "10px";
      button.style.cursor = "pointer";
      button.style.padding = "5px";
      button.style.border = "1px solid #ccc";
      button.style.backgroundColor = "#f0f0f0";
      button.style.borderRadius = "5px";
      button.style.position = "relative"; // Required for absolute tooltip positioning

      // Create answer tooltip (hidden initially)
      const tooltip = document.createElement("div");
      tooltip.className = "answer-tooltip";
      tooltip.style.display = "none";
      tooltip.style.position = "absolute";
      tooltip.style.bottom = "100%"; // Position above button
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.marginBottom = "5px";
      tooltip.style.padding = "8px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      tooltip.style.color = "#fff";
      tooltip.style.fontSize = "12px";
      tooltip.style.whiteSpace = "nowrap";
      tooltip.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";
      tooltip.innerHTML = `<strong>Answer:</strong> ${answer} <br> <strong>Confidence:</strong> ${confidence}%`;

      // Toggle tooltip visibility on button click
      button.addEventListener("click", () => {
        tooltip.style.display =
          tooltip.style.display === "none" ? "block" : "none";
      });

      // Close tooltip when clicking anywhere outside
      document.addEventListener("click", (event) => {
        if (!button.contains(event.target)) {
          tooltip.style.display = "none";
        }
      });

      // Insert button **next to** the question element
      targetElement.insertAdjacentElement("afterend", button);
      button.appendChild(tooltip); // Append tooltip inside button for positioning
    }
  });
}
