const express = require('express');
const router = express.Router();
//const fetch = require('node-fetch');

// Constants
const PAGE_SIZE = 10;
const BASE_URL = "https://api.myscheme.gov.in/search/v4/schemes";
const API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc";
console.log("searchRouter.js");
router.get('/schemes', async (req, res) => {
    try {
        const {
            maritalStatus,
            disability,
            caste,
            gender,
            beneficiaryState,
            age,
            disabilityPercentage,
            bpl,
            occupation,
            page = 0
        } = req.query;

        // Build query parameters array
        const queryParams = [];

        if (maritalStatus) queryParams.push({ identifier: "maritalStatus", value: maritalStatus });
        if (disability) queryParams.push({ identifier: "disability", value: disability });
        if (caste) queryParams.push({ identifier: "caste", value: caste });
        if (gender && gender !== "All") queryParams.push({ identifier: "gender", value: gender });
        if (beneficiaryState && beneficiaryState !== "All") {
            queryParams.push({ identifier: "beneficiaryState", value: beneficiaryState });
        }

        // Handle age range
        if (age) {
            const [min, max] = age.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                queryParams.push({ identifier: "age-general", min, max });
            }
        }

        // Handle BPL status
        if (bpl) queryParams.push({ identifier: "isBpl", value: bpl });

        // Handle disability percentage
        if (disabilityPercentage && disabilityPercentage !== "fghytrdfghj") {
            queryParams.push({
                identifier: "disabilityPercentage",
                min: disabilityPercentage,
                max: disabilityPercentage
            });
        }

        // Handle occupation
        if (occupation && occupation !== "gnhm" && occupation !== "Al") {
            queryParams.push({ identifier: "occupation", value: occupation });
        }

        const queryParamsString = JSON.stringify(queryParams);
        const from = parseInt(page) * PAGE_SIZE;

        const url = `${BASE_URL}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=&sort=&from=${from}&size=${PAGE_SIZE}`;

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json",
                "X-API-Key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Calculate total pages
        const totalPages = Math.ceil(data.data.hits.page.total / PAGE_SIZE);

        // Format response
        const formattedResponse = {
            results: data.data.hits.items,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                pageSize: PAGE_SIZE,
                totalItems: data.data.hits.page.total
            }
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router;