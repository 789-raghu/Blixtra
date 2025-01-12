// const express = require('express');
// const router = express.Router();
// const Groq = require('groq-sdk');
//
// const groq = new Groq({ apiKey: "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" });
//
// async function getChatResponse(message,targetLanguage) {
//     try {
//         const chatCompletion = await groq.chat.completions.create({
//             "messages": [
//                 {
//                     "role": "system",
//                     "content": `Translate the content to the ${targetLanguage}`
//                 },
//                 {
//                     "role": "user",
//                     "content": message
//                 }
//             ],
//             "model": "llama-3.3-70b-versatile",
//             "temperature": 1,
//             "max_tokens": 6000,
//             "top_p": 1,
//             "stream": true,
//             "stop": null
//         });
//
//         let response = '';
//         for await (const chunk of chatCompletion) {
//             response += chunk.choices[0]?.delta?.content || '';
//         }
//
//         return response;
//     } catch (error) {
//         console.error('Groq API error:', error);
//         throw new Error('Unable to fetch response from Groq API');
//     }
// }
//
// router.post('/', async (req, res) => {
//     try {
//         const message = req.body.message;
//         if (!message) {
//             return res.status(400).send({ error: "Message is required." });
//         }
//
//         const botResponse = await getChatResponse(message);
//         res.send({ message: botResponse });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send({ error: 'Something went wrong.' });
//     }
// });
//
// module.exports = router;

let currentLanguage = "en";

document.getElementById("languages").addEventListener("change", async (event) => {
    const targetLanguage = event.target.value;
    const elementsToTranslate = document.querySelectorAll(".translation");
    const contentArray = Array.from(elementsToTranslate).map((element) => element.textContent.trim());

    try {
        const fromLanguage = currentLanguage;
        console.log(`Selected Language: ${targetLanguage}`);
        if(targetLanguage === "en") {
            window.location.reload();
            return;
        }
        const translatedData = await openGoogleTranslator.TranslateLanguageData({
            listOfWordsToTranslate: contentArray,
            toLanguage: targetLanguage,
        });
        elementsToTranslate.forEach((element, index) => {
            const {translation} = translatedData[index];
            element.textContent = translation; // Update the text content
            console.log(element.textContent);
        });
        document.documentElement.lang = targetLanguage;
        currentLanguage = targetLanguage;

    } catch (error) {
        console.error("Error during translation:", error);
        alert("Translation failed. Please try again.");
    }
});

