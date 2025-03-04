console.log("I am content.js");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchFormData") {
    let form = null;

    if (message.isGoogleForm) {
      form = document.querySelector("form");
    } else {
      form = document.querySelector(message.selector);
    }
    console.log("Form:", form, message.selector);
    if (form) {
      chrome.runtime.sendMessage({
        formData: form.outerHTML,
        action: "fetchAIResponse",
      });
    }
  } else if (message.action === "insertData") {
    console.log("Inserting data", message.data);
    insertAnswers(message.data);
    chrome.runtime.sendMessage({ action: "dataInserted" });
  }
});

function insertAnswers(data) {
  // Inject CSS styles into the document
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .answer-tooltip {
      display: none;
      position: absolute;
      bottom: calc(100% + 5px); /* Slightly above button with spacing */
      left: 50%;
      transform: translateX(-50%);
      padding: 10px; /* Increased padding for better spacing */
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.85); /* Slightly darker for contrast */
      color: #fff;
      font-size: 14px; /* Slightly larger font for readability */
      white-space: pre-wrap; /* Respect line breaks and wrap long lines */
      min-width: 250px; /* Increased min-width */
      max-width: 500px; /* Increased max-width for longer content */
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* Softer shadow */
      text-align: left; /* Left-align text for readability */
      line-height: 1.4; /* Better line spacing */
    }
    .show-answer-btn {
      margin-left: 10px;
      cursor: pointer;
      padding: 6px 10px; /* Slightly larger padding */
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      border-radius: 5px;
      position: relative;
      font-size: 12px; /* Consistent font size */
    }
    .show-answer-btn:hover {
      background-color: #e0e0e0; /* Hover effect for better UX */
    }
  `;
  document.head.appendChild(styleElement);

  // Single click listener for closing tooltips outside of buttons
  const closeTooltips = (event) => {
    document.querySelectorAll(".answer-tooltip").forEach((tooltip) => {
      const button = tooltip.parentElement;
      if (!button.contains(event.target)) {
        tooltip.style.display = "none";
      }
    });
  };

  // Add the listener once, outside the loop
  document.removeEventListener("click", closeTooltips); // Remove any existing listener to avoid duplicates
  document.addEventListener("click", closeTooltips);

  data.forEach(
    ({
      question,
      answer,
      numericAnswer,
      confidence,
      identifier,
      questionType,
    }) => {
      let targetElement = null;

      // Try to find the target element using the identifier first
      try {
        targetElement = document.querySelector(identifier);
      } catch (e) {
        console.warn(`Invalid selector for identifier "${identifier}":`, e);
      }

      // Fallback: Search for the question text in p, span, div, or label elements
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
        ) {
          return;
        }

        // Create "Show Answer" button
        const button = document.createElement("button");
        button.textContent = "Show Answer";
        button.className = "show-answer-btn";

        // Format the answer based on questionType
        let answerText;
        if (questionType === "textfield") {
          // Use numericAnswer if available, otherwise fall back to answer array
          answerText =
            numericAnswer !== undefined && numericAnswer !== null
              ? numericAnswer
              : Array.isArray(answer) && answer.length > 0
              ? answer.join(", ")
              : "No answer provided";
        } else {
          // For multiple-choice and single-choice, number each answer on a new line
          answerText =
            Array.isArray(answer) && answer.length > 0
              ? answer.map((ans, index) => `${index + 1}. ${ans}`).join("\n")
              : "No answer provided";
        }

        // Create answer tooltip (hidden initially)
        const tooltip = document.createElement("div");
        tooltip.className = "answer-tooltip";
        tooltip.innerHTML = `
          \n${answerText}\n<br>
          <strong>Confidence:</strong> ${
            confidence !== undefined ? (confidence * 100).toFixed(1) : "N/A"
          }%
        `;

        // Toggle tooltip visibility on button click
        button.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent the document click listener from immediately closing it
          tooltip.style.display =
            tooltip.style.display === "none" ? "block" : "none";
        });

        // Insert button next to the question element
        targetElement.insertAdjacentElement("afterend", button);
        button.appendChild(tooltip); // Append tooltip inside button for positioning
      } else {
        console.warn(
          `Could not find target element for question: "${question}"`
        );
      }
    }
  );
}
