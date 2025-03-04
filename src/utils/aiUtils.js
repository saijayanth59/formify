export const generationConfig = {
  temperature: 1,
  response_schema: {
    type: "array",
    description:
      "Extracted structured questions and their details from raw form data, excluding personal fields like name, ID, roll number, email, and phone number. Each question includes an identifier(className or Id), type, options (if applicable), possible correct answer(s), and a confidence score.",
    items: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The extracted question text.",
        },
        identifier: {
          type: "string",
          description:
            "The className or ID where the question div is located in the DOM. example: '.question1', '#question2'.",
        },
        questionType: {
          type: "string",
          description:
            "The type of question: 'multiple-choice' (multiple answers possible), 'single-choice' (one answer possible), or 'textfield' (free text response).",
          enum: ["multiple-choice", "single-choice", "textfield"],
        },
        options: {
          type: "array",
          description:
            "List of answer options (applicable only for 'multiple-choice' and 'single-choice' questions; empty for 'textfield').",
          items: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "The text of the option.",
              },
            },
            required: ["text"],
          },
        },
        answer: {
          type: "array",
          description:
            "The most likely correct answer(s) for the question. An array of strings, with multiple items for 'multiple-choice' if applicable, or a single item for 'single-choice' and 'textfield'.",
          items: {
            type: "string",
            description: "An individual answer.",
          },
        },
        confidence: {
          type: "number",
          description:
            "A confidence score (between 0 and 1) indicating the correctness of the answer(s).",
        },
        numericAnswer: {
          type: "number",
          description: "The numeric value of the answer, if applicable.",
        },
      },
      required: [
        "question",
        "identifier",
        "questionType",
        "options",
        "confidence",
      ],
    },
  },
  response_mime_type: "application/json",
};

export const prompt = `
      Extract structured question data from the given raw form data. For each question, include:
      - The full question text.
      - The className or ID of the div where the question is located in the DOM (identifier).
      - The type of question:
        - "multiple-choice" if the question allows multiple correct answers (e.g., checkboxes).
        - "single-choice" if the question allows only one correct answer (e.g., radio buttons or dropdowns).
        - "textfield" if the question expects a free-text response (e.g., input or textarea).
      - A list of answer options (for "multiple-choice" and "single-choice" questions only; leave empty for "textfield").
      - A possible correct answer for the question as an array:
        - For "multiple-choice", include multiple strings in the array if multiple answers are correct (e.g., ["Red", "Blue"]).
        - For "single-choice" or "textfield", include a single string in the array (e.g., ["Banana"] or ["25"]).
      - A confidence score (between 0 and 1) indicating the correctness of the answer(s).
      
      **Important:**
      - If a question is related to personal fields (such as Name, ID, Roll Number, Email, or Phone Number), **do not include it in the response**.
      - Ensure that the response follows the provided schema and contains all necessary details, including the question text, identifier, questionType, options (if applicable), answer (as an array), and confidence score.
      `;
