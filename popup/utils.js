export const generationConfig = {
  temperature: 1,
  response_schema: {
    type: "array",
    description:
      "Extracted structured questions and options from raw form data, excluding personal fields like name, ID, roll number, email, and phone number. Each question includes an identifier, a possible correct answer, and its confidence score.",
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
            "The className where the question div is located in the DOM.",
        },
        options: {
          type: "array",
          description: "List of answer options.",
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
          type: "string",
          description: "The most likely correct answer for the question.",
        },
        confidence: {
          type: "number",
          description:
            "A confidence score (between 0 and 1) indicating the correctness of the answer.",
        },
      },
      required: ["question", "identifier", "options", "answer", "confidence"],
    },
  },
  response_mime_type: "application/json",
};

export const prompt = `
  Extract structured question data from the given raw form data. For each question, include:
  - The full question text.
  - The className of the div where the question is located in the DOM (identifier).
  - A list of answer options, where each option is represented by its text.
  - A possible correct answer for the question.
  - A confidence score (between 0 and 1) indicating the correctness of the answer.
  
  **Important:** 
  - If a question is related to personal fields (such as Name, ID, Roll Number, Email, or Phone Number), **do not include it in the response**.
  - Ensure that the response follows the provided schema and contains all necessary details, including the question text, identifier, options, answer, and confidence score.
  `;
