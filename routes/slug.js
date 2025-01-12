const express = require('express');
const usermodel = require("../Model/usersmodel");
const router = express.Router();

const dictionary = {
    table: "table border border-gray-300 w-full text-sm text-left mx-auto",
    align_justify: "div text-justify",
    list_item: "li list-decimal ml-5",
    paragraph: "p mb-4 text-gray-800",
    ol_list: "ol list-decimal ml-5",
    ul_list: "ul list-disc ml-5",
    bold: "strong font-bold",
    table_row: "tr",
    title:"p mb-4 text-gray-800 hover:underline text-lg",
    table_cell: "td border border-gray-300 px-5 py-2 min-w-[150px]",
    block_quote: "blockquote border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4",
};

function jsonToHtml(json) {
    if (Array.isArray(json)) {
        return json.map(jsonToHtml).join(""); // Convert each element recursively
    }

    if (typeof json === "object") {
        const { type, children, text, bold, link} = json;

        if (text) {
            return bold ? `<strong class="my-5">${text}</strong>` : text;
        }

        if (link) {
            const linkChildren = children ? jsonToHtml(children) : "";
            return `<a href="${link}" target="_blank">${linkChildren}</a>`;
        }

        const tag = dictionary[type] || "div"; // Default to "div" if type is not in the dictionary
        const childHtml = children ? jsonToHtml(children) : "";

        return `<${tag}>${childHtml}</${tag}>`;
    }

    return "";
}


router.get('/', async (req, res) => {
    const slug = req.query.slug;
    const inputJson = await fetch(`https://www.myscheme.gov.in/_next/data/xwtFZuHFfQ_CBeu9-JS7Q/en/schemes/${slug}.json?slug=${slug}`);
    const data = await inputJson.json();
    const title = data.pageProps.schemeData.en.basicDetails.schemeName;
    const details = jsonToHtml(data.pageProps.schemeData.en.schemeContent.detailedDescription);
    const benefits = jsonToHtml(data.pageProps.schemeData.en.schemeContent.benefits);
    const eligibility = jsonToHtml(data.pageProps.schemeData.en.eligibilityCriteria.eligibilityDescription);
    const documents = jsonToHtml(data.pageProps.docs.data.en.documents_required);

    const application = new Map();  // Initialize a new Map to hold the key-value pairs
    const documentsRequired = data.pageProps.schemeData.en.applicationProcess;
    console.log(documentsRequired);
    for (const documentsRequiredKey in documentsRequired) {
        if (documentsRequired[documentsRequiredKey] && documentsRequired[documentsRequiredKey].mode) {
            const mode = documentsRequired[documentsRequiredKey].mode;
            const processContent = jsonToHtml(documentsRequired[documentsRequiredKey].process);
            application.set(mode, processContent);
        }
    }
    const faqs = data.pageProps.faqs.data.en.faqs;
    const Guidelines = `
  <div style="font-family: Arial, sans-serif; margin: 20px; line-height: 1.8; color: #333;">
    ${data.pageProps.schemeData.en.schemeContent.references.map((ele) => {
        return `<a href="${ele.url}" 
                  style="text-decoration: none; color: black; font-size: 1.2rem;" 
                  target="_blank"
                  onmouseover="this.style.textDecoration='underline'" 
                  onmouseout="this.style.textDecoration='none'">
                ${ele.title} 🔗
              </a>
<hr>`;
    }).join('<br>')}
  </div>`;
    if(req.session.user){
        // const user = await usermodel.findOne({ emailId: email});
        return res.render('slugs', { email: req.session.user.email,
            title: title,
            details: details,
            benefits: benefits,
            onlineApplication: application.get('Online'),
            offlineApplication: application.get('Offline'),
            documents: documents,
            eligibility: eligibility,
            faqs: faqs,
            Guidelines:Guidelines});
    }
    res.render('slug', {
        title: title,
        details: details,
        benefits: benefits,
        onlineApplication: application.get('Online'),
        offlineApplication: application.get('Offline'),
        documents: documents,
        eligibility: eligibility,
        faqs: faqs,
        Guidelines:Guidelines
    });
});


// Export the helpers for use in other files
module.exports = {router};