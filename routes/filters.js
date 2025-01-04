const express = require('express');
const router = express.Router();

// Constants for dropdown options
const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry'
];

const occupations = [
    { value: 'Al', label: 'Not Listed here' },
    { value: 'All', label: 'All' },
    { value: 'Construction Worker', label: 'Construction Worker' },
    { value: 'Unorganized Worker', label: 'Unorganized Worker' },
    { value: 'Ex Servicemen', label: 'Ex Servicemen' },
    { value: 'Student', label: 'Student' },
    { value: 'Artists', label: 'Artists' },
    { value: 'Safai Karamchari', label: 'Safai Karamchari' },
    { value: 'Sportsperson', label: 'Sportsperson' },
    { value: 'Coir Worker', label: 'Coir Worker' },
    { value: 'Teacher / Faculty', label: 'Teacher / Faculty' },
    { value: 'Health Worker', label: 'Health Worker' },
    { value: 'Khadi Artisan', label: 'Khadi Artisan' },
    { value: 'Street Vendor', label: 'Street Vendor' },
    { value: 'Fishermen', label: 'Fishermen' },
    { value: 'Artisans, Spinners & Weavers', label: 'Artisans, Spinners & Weavers' },
    { value: 'Farmer', label: 'Farmer' },
    { value: 'Organized Worker', label: 'Organized Worker' }
];


// POST route to handle search requests with filtering
router.post('/api/search', async (req, res) => {
    const {
        maritalStatus,
        disability,
        caste,
        gender,
        beneficiaryState,
        ageRange,
        disabilityPercentage,
        bpl,
        occupation
    } = req.body;

    const pageSize = 100; // For pagination
    const queryParams = [];
    if (maritalStatus) queryParams.push({ identifier: "maritalStatus", value: maritalStatus });
    if (disability) queryParams.push({ identifier: "disability", value: disability });
    if (caste) queryParams.push({ identifier: "caste", value: caste });
    if (gender && gender !== "All") queryParams.push({ identifier: "gender", value: gender });
    if (beneficiaryState && beneficiaryState !== "All") queryParams.push({ identifier: "beneficiaryState", value: beneficiaryState });
    if (ageRange) queryParams.push({ identifier: "ageRange", value: ageRange });
    if (disabilityPercentage) queryParams.push({ identifier: "disabilityPercentage", value: disabilityPercentage });
    if (bpl) queryParams.push({ identifier: "isBpl", value: bpl });
    if (occupation) queryParams.push({ identifier: "occupation", value: occupation });

    const queryParamsString = JSON.stringify(queryParams);
    const baseUrl = "https://api.myscheme.gov.in/search/v4/schemes";
    const headers = {
        "Accept": "application/json",
        "X-API-Key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
    };

    try {
        console.log("Requesting first page...");
        const initialUrl = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&from=0&size=${pageSize}`;
        const initialResponse = await fetch(initialUrl, { headers });

        if (!initialResponse.ok) {
            console.error("API Error Response:", initialResponse.status, initialResponse.statusText);
            return res.status(initialResponse.status).json({ error: `Error fetching data: ${initialResponse.statusText}` });
        }

        const initialData = await initialResponse.json();
        const totalPages = Math.ceil((initialData.data.hits.page.total || 0) / pageSize);
        let allResults = initialData.data.hits.items || [];

        console.log(`Total Pages: ${totalPages}`);

        // Fetch remaining pages
        for (let currentPage = 1; currentPage < totalPages; currentPage++) {
            const paginatedUrl = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&from=${currentPage * pageSize}&size=${pageSize}`;
            console.log(`Requesting page ${currentPage + 1}...`);
            const response = await fetch(paginatedUrl, { headers });

            if (!response.ok) {
                console.error(`API Error on page ${currentPage + 1}:`, response.status, response.statusText);
                return res.status(response.status).json({ error: `Error fetching data on page ${currentPage + 1}: ${response.statusText}` });
            }

            const paginatedData = await response.json();
            allResults = allResults.concat(paginatedData.data.hits.items || []);
        }
        res.json({
            results: allResults,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error fetching schemes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/', async (req, res) => {
    if (req.session && req.session.user) {
        res.render('filters',{title:'filters'});
    }
    else{
        res.render('filter', {
            states: states,
            occupations: occupations
        });
    }
});

module.exports = router;