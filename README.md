# SmartForm Filler - Chrome Extension

## Overview

SmartForm Filler is a Chrome extension that extracts form data, analyzes it using AI, and inserts AI-generated responses into web forms for quick completion.

## Features

- Automatically detects and extracts form data from web pages.
- Uses AI (Gemini API) to generate relevant responses.
- Inserts AI-generated answers into form fields.
- Simple popup interface for easy access.

## Installation

1. Download the extension files.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click on **Load unpacked** and select the folder containing the extension files.
5. The extension will now appear in your Chrome toolbar.

## Usage

1. Navigate to a webpage with a form.
2. Click on the **SmartForm Filler** extension icon in the toolbar.
3. Click the **"Get answers"** button in the popup.
4. The extension will extract form data and send it to an AI model.
5. The AI-generated responses will be inserted into the corresponding fields.
6. Review and submit the form as needed.

## Permissions

The extension requests the following permissions:

- `storage`: To store temporary data.
- `tabs`: To access the currently open tab.
- `scripting`: To modify web pages.
- `host_permissions`: To allow interaction with all web pages (`<all_urls>`).

## Notes

- Ensure you have an active API key for AI processing.
- The extension does not store or transmit user data beyond the AI request.
- You can disable or remove the extension anytime from `chrome://extensions/`.

## Future Improvements

- Support for more form structures.
- Customizable AI response filtering.
- Improved UI with additional controls.

## License

This project is licensed under the MIT License.
