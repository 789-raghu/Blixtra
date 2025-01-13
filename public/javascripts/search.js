document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 0;
    const pageSize = 10;
    let currentResults = null;
    let totalPages = 0;

    // Function to handle filter changes
    const handleFilterChange = () => {
        // Clear cached data when filters are changed
        sessionStorage.removeItem('cachedResults');
        currentPage = 0; // Reset page number to 0
        handleSearch(); // Trigger a new request with updated filter
        handleSSearch();
        handleSSSearch();

    };

    // Attach event listeners to filter inputs
    document.getElementById('maritalStatus').addEventListener('change', handleFilterChange);
    document.getElementById('disability').addEventListener('change', handleFilterChange);
    document.getElementById('caste').addEventListener('change', handleFilterChange);
    document.getElementById('gender').addEventListener('change', handleFilterChange);
    document.getElementById('beneficiaryState').addEventListener('change', handleFilterChange);
    document.getElementById('age').addEventListener('change', handleFilterChange);
    document.getElementById('disabilityPercentage').addEventListener('change', handleFilterChange);
    document.getElementById('bpl').addEventListener('change', handleFilterChange);
    document.getElementById('occupation').addEventListener('change', handleFilterChange);
    document.getElementById('languages').addEventListener('change', handleFilterChange)
    document.getElementById('default-search').addEventListener('input',handleFilterChange);//SSP


    const cachedResults = sessionStorage.getItem('cachedResults');
    if (cachedResults) {
        const cachedData = JSON.parse(cachedResults);
        currentResults = cachedData.results;
        totalPages = cachedData.totalPages;
        renderResults(currentResults);
        renderPagination(totalPages);
    }

    const handleSearch = async (page = 0) => {
        const maritalStatus = document.getElementById('maritalStatus').value;
        const disability = document.getElementById('disability').value;
        const caste = document.getElementById('caste').value;
        const gender = document.getElementById('gender').value;
       // const beneficiaryState = document.getElementById('beneficiaryState').value;
        const ageRange = document.getElementById('age').value;
        const disabilityPercentage = document.getElementById('disabilityPercentage').value;
        const bpl = document.getElementById('bpl').value;
        const occupation = document.getElementById('occupation').value;
        let disabilityMin = null, disabilityMax = null;
        let ageMin = null, ageMax = null;
       const keyword=document.getElementById('default-search').value;


        if (ageRange) {
            const [min, max] = ageRange.split('-').map(Number);
            ageMin = min || null;
            ageMax = max || null;
        }

        const queryParams = [];
        if (maritalStatus) queryParams.push({identifier: "maritalStatus", value: maritalStatus});
        if (disability && disability !== "enc") queryParams.push({identifier: "disability", value: disability});
        if (caste) queryParams.push({identifier: "caste", value: caste});
        if (gender && gender !== "All") queryParams.push({identifier: "gender", value: gender});
        //if (beneficiaryState && beneficiaryState !== "All") queryParams.push({
          //  identifier: "beneficiaryState",
          //  value: beneficiaryState
       // });
        if (ageMin !== null && ageMax !== null) {
            queryParams.push({identifier: "age-general", min: ageMin, max: ageMax});
        }

        queryParams.push({identifier:"level",value:"Central"});
        if (bpl && bpl !== 'enc') queryParams.push({identifier: "isBpl", value: bpl});
        if (disabilityPercentage !== "fghytrdfghj") {
            disabilityMin = disabilityPercentage;
            disabilityMax = disabilityPercentage;
            queryParams.push({identifier: "disabilityPercentage", min: disabilityMin, max: disabilityMax});
        }
        if (occupation !== "gnhm" && occupation !== "Al") queryParams.push({
            identifier: "occupation",
            value: occupation
        });
        const queryParamsString = JSON.stringify(queryParams);
        const baseUrl = "https://api.myscheme.gov.in/search/v4/schemes";
        const from = page * pageSize;
        //const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=&sort=&from=${from}&size=5`;
        const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=${encodeURIComponent(keyword)}&sort=&from=${from}&size=5`;//SSP
        const headers = {
            "Accept": "application/json",
            "X-API-Key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
        };

        try {
            const response = await fetch(url, {headers});
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            currentPage = page;
            totalPages = Math.ceil(data.data.hits.page.total / pageSize);

            currentResults = data.data.hits.items;

            // Cache the results
            sessionStorage.setItem('cachedResults', JSON.stringify({
                results: currentResults,
                totalPages: totalPages
            }));

            await renderResults(currentResults);
            renderPagination(totalPages);
            console.log(url);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
    };




    const handleSSearch = async (page = 0) => {
        const maritalStatus = document.getElementById('maritalStatus').value;
        const disability = document.getElementById('disability').value;
        const caste = document.getElementById('caste').value;
        const gender = document.getElementById('gender').value;
         const beneficiaryState = document.getElementById('beneficiaryState').value;
        const ageRange = document.getElementById('age').value;
        const disabilityPercentage = document.getElementById('disabilityPercentage').value;
        const bpl = document.getElementById('bpl').value;
        const occupation = document.getElementById('occupation').value;
        let disabilityMin = null, disabilityMax = null;
        let ageMin = null, ageMax = null;
        const keyword=document.getElementById('default-search').value;


        if (ageRange) {
            const [min, max] = ageRange.split('-').map(Number);
            ageMin = min || null;
            ageMax = max || null;
        }

        const queryParams = [];
        if (maritalStatus) queryParams.push({identifier: "maritalStatus", value: maritalStatus});
        if (disability && disability !== "enc") queryParams.push({identifier: "disability", value: disability});
        if (caste) queryParams.push({identifier: "caste", value: caste});
        if (gender && gender !== "All") queryParams.push({identifier: "gender", value: gender});

        if (beneficiaryState && beneficiaryState!=="All") queryParams.push({
          identifier: "beneficiaryState",
         value: beneficiaryState
         });
        else queryParams.push({
            identifier: "level",
            value:"State"
        });
        if (ageMin !== null && ageMax !== null) {
            queryParams.push({identifier: "age-general", min: ageMin, max: ageMax});
        }
        if (bpl && bpl !== 'enc') queryParams.push({identifier: "isBpl", value: bpl});
        if (disabilityPercentage !== "fghytrdfghj") {
            disabilityMin = disabilityPercentage;
            disabilityMax = disabilityPercentage;
            queryParams.push({identifier: "disabilityPercentage", min: disabilityMin, max: disabilityMax});
        }
        if (occupation !== "gnhm" && occupation !== "Al") queryParams.push({
            identifier: "occupation",
            value: occupation
        });

        const queryParamsString = JSON.stringify(queryParams);
        const baseUrl = "https://api.myscheme.gov.in/search/v4/schemes";
        const from = page * pageSize;
        //const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=&sort=&from=${from}&size=5`;
        const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=${encodeURIComponent(keyword)}&sort=&from=${from}&size=5`;//SSP
        const headers = {
            "Accept": "application/json",
            "X-API-Key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
        };

        try {
            const response = await fetch(url, {headers});
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            currentPage = page;
            totalPages = Math.ceil(data.data.hits.page.total / pageSize);

            currentResults = data.data.hits.items;

            // Cache the results
            sessionStorage.setItem('cachedResults', JSON.stringify({
                results: currentResults,
                totalPages: totalPages
            }));

            await renderSResults(currentResults);
            renderSPagination(totalPages);
            console.log(url);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
    };




    async function translationPages(words, language) {
        try {
            console.log(words);
            if (!words || !Array.isArray(words) || words.length === 0) {
                throw new Error("Invalid input: 'words' must be a non-empty array.");
            }
            console.log(words);
            const fromLanguage = currentLanguage || "en"; // Default to English if not set
            const targetLanguage = language || document.getElementById('languages').value;

            console.log(`Translating from '${fromLanguage}' to '${targetLanguage}'`);
            console.log(`Words to translate:`, words);

            // Call the translation API/library
            const translatedData = await openGoogleTranslator.TranslateLanguageData({
                listOfWordsToTranslate: words,
                toLanguage: targetLanguage,
            });

            if (!translatedData || translatedData.length === 0) {
                throw new Error("Translation API returned no results.");
            }

            // console.log("Translated Data:", translatedData);
            // console.log(translatedData[0].translation);
            return translatedData[0].translation;
        } catch (error) {
            console.log("Error during translation:", error);
            return words;
        }
    }

    // Function to render results
    async function renderResults(data) {
        console.log(data);
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        if (data && Array.isArray(data) && data.length > 0) {
            // Collect promises to await all translations
            const resultPromises = data.map(async function (scheme) {
                let targetLanguage = document.getElementById('languages').value;
                console.log('translation :' + await translationPages([scheme.fields.schemeName], targetLanguage));
                const schemeName = await translationPages([scheme.fields.schemeName], targetLanguage) || 'No name available';
                const schemeDescription = await translationPages([scheme.fields.briefDescription], targetLanguage) || 'No description available';
                const beneficiaryState = scheme.fields.beneficiaryState && scheme.fields.beneficiaryState.join(', ') || 'No state available';
                const slug = scheme.fields.slug || '';
                console.log('translation :' + schemeName);
                return `
                 <div class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-2xl hover:translate-y-1 transition-all duration-500 ease-in-out transform cursor-pointer search-items m-2">
                    <p class="lg:text-2xl sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        <a href="/slug?slug=${slug}" class="hover:underline">${schemeName}</a>
                    </p>
                    <em class="block text-gray-500 text-sm mb-4">
                        State: <span class="text-gray-700">${beneficiaryState}</span>
                    </em>
                    <p class="text-gray-600 text-base my-2">${schemeDescription}</p>
                </div>
             `;
            });

            const resultsHtml = await Promise.all(resultPromises);
            resultsList.innerHTML = resultsHtml.join('');
        } else {
            const noResultsMessage = document.createElement('li');
            noResultsMessage.innerHTML = 'No schemes found.';
            resultsList.appendChild(noResultsMessage);
        }
    }
    async function renderSResults(data) {
        console.log(data);
        const stateresultsList = document.getElementById('stateresultsList');
        stateresultsList.innerHTML = '';

        if (data && Array.isArray(data) && data.length > 0) {
            // Collect promises to await all translations
            const resultPromises = data.map(async function (scheme) {
                let targetLanguage = document.getElementById('languages').value;
                console.log('translation :' + await translationPages([scheme.fields.schemeName], targetLanguage));
                const schemeName = await translationPages([scheme.fields.schemeName], targetLanguage) || 'No name available';
                const schemeDescription = await translationPages([scheme.fields.briefDescription], targetLanguage) || 'No description available';
                const beneficiaryState = scheme.fields.beneficiaryState && scheme.fields.beneficiaryState.join(', ') || 'No state available';
                const slug = scheme.fields.slug || '';
                console.log('translation :' + schemeName);
                return `
                 <div class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-2xl hover:translate-y-1 transition-all duration-500 ease-in-out transform cursor-pointer search-items m-2">
                    <p class="lg:text-2xl sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        <a href="/slug?slug=${slug}" class="hover:underline">${schemeName}</a>
                    </p>
                    <em class="block text-gray-500 text-sm mb-4">
                        State: <span class="text-gray-700">${beneficiaryState}</span>
                    </em>
                    <p class="text-gray-600 text-base my-2">${schemeDescription}</p>
                </div>
             `;
            });

            const renderedResults = await Promise.all(resultPromises);
            stateresultsList.innerHTML = renderedResults.join('');
        } else {
            const noResultsMessage = document.createElement('li');
            noResultsMessage.innerHTML = 'No schemes found.';
            stateresultsList.appendChild(noResultsMessage);
            console.log(stateresultsList);
        }
    }




    // Function to render pagination
    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination') || createPaginationContainer();
        paginationContainer.innerHTML = ''; // Clear existing pagination buttons

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←Prev';
        prevButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        prevButton.disabled = currentPage === 0; // Disable if on the first page
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                handleSearch(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page Number Buttons
        const startPage = Math.max(0, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerHTML = i + 1;
            pageButton.className = `flex items-center justify-center p-5 h-8 text-sm font-medium ${
                i === currentPage
                    ? 'bg-gray-900 text-white p-5'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
            }`;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                handleSearch(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next→';
        nextButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        nextButton.disabled = currentPage === totalPages - 1; // Disable if on the last page
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                currentPage++;
                handleSearch(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

// Function to create a pagination container
    function createPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination';
        container.className = 'flex items-center mt-5 justify-center';
        document.getElementById('resultsList').parentNode.appendChild(container);
        return container;
    }


    function renderSPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination1') || createSPaginationContainer();
        paginationContainer.innerHTML = ''; // Clear existing pagination buttons

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←Prev';
        prevButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        prevButton.disabled = currentPage === 0; // Disable if on the first page
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                handleSSearch(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page Number Buttons
        const startPage = Math.max(0, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerHTML = i + 1;
            pageButton.className = `flex items-center justify-center p-5 h-8 text-sm font-medium ${
                i === currentPage
                    ? 'bg-gray-900 text-white p-5'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
            }`;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                handleSSearch(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('button2');
        nextButton.innerHTML = 'Next→';
        nextButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        nextButton.disabled = currentPage === totalPages - 1; // Disable if on the last page
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                currentPage++;
                handleSSearch(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

// Function to create a pagination container
    function createSPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination1';
        container.className = 'flex items-center mt-5 justify-center';
        document.getElementById('stateresultsList').parentNode.appendChild(container);
        return container;
    }



    const handleSSSearch = async (page = 0) => {

        const queryParams = [];
        //queryParams.push({identifier: "level", value: "Central"});

        queryParams.push({identifier: "disability", value: "No"});
        queryParams.push({identifier: "beneficiaryState", value: "Maharashtra"})
        queryParams.push({identifier: "gender", value: "Female"});
        const queryParamsString = JSON.stringify(queryParams);
        const baseUrl = "https://api.myscheme.gov.in/search/v4/schemes";
        const from = page * pageSize;
        const keyword=document.getElementById('default-search').value;
       // const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=&sort=&from=${from}&size=5`;
        const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=${encodeURIComponent(keyword)}&sort=&from=${from}&size=5`;//SSP
        const headers = {
            "Accept": "application/json",
            "X-API-Key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
        };

        try {
            const response = await fetch(url, {headers});
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            currentPage = page;
            totalPages = Math.ceil(data.data.hits.page.total / pageSize);

            currentResults = data.data.hits.items;

            // Cache the results
            sessionStorage.setItem('cachedResults', JSON.stringify({
                results: currentResults,
                totalPages: totalPages
            }));

            await renderSSSResults(currentResults);
            renderSSSPagination(totalPages);
            console.log(url);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
    };
    async function renderSSSResults(data) {
        console.log(data);
        const resultsList = document.getElementById('SuggestedList');
        resultsList.innerHTML = '';

        if (data && Array.isArray(data) && data.length > 0) {
            // Collect promises to await all translations
            const resultPromises = data.map(async function (scheme) {
                let targetLanguage = document.getElementById('languages').value;
                console.log('translation :' + await translationPages([scheme.fields.schemeName], targetLanguage));
                const schemeName = await translationPages([scheme.fields.schemeName], targetLanguage) || 'No name available';
                const schemeDescription = await translationPages([scheme.fields.briefDescription], targetLanguage) || 'No description available';
                const beneficiaryState = scheme.fields.beneficiaryState && scheme.fields.beneficiaryState.join(', ') || 'No state available';
                const slug = scheme.fields.slug || '';
                console.log('translation :' + schemeName);
                return `
                 <div class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-2xl hover:translate-y-1 transition-all duration-500 ease-in-out transform cursor-pointer search-items m-2">
                    <p class="lg:text-2xl sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        <a href="/slug?slug=${slug}" class="hover:underline">${schemeName}</a>
                    </p>
                    <em class="block text-gray-500 text-sm mb-4">
                        State: <span class="text-gray-700">${beneficiaryState}</span>
                    </em>
                    <p class="text-gray-600 text-base my-2">${schemeDescription}</p>
                </div>
             `;
            });

            const resultsHtml = await Promise.all(resultPromises);
            resultsList.innerHTML = resultsHtml.join('');
        } else {
            const noResultsMessage = document.createElement('li');
            noResultsMessage.innerHTML = 'No schemes found.';
            resultsList.appendChild(noResultsMessage);
        }
    }
    function renderSSSPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination2') || createSSSPaginationContainer();
        paginationContainer.innerHTML = ''; // Clear existing pagination buttons

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←Prev';
        prevButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        prevButton.disabled = currentPage === 0; // Disable if on the first page
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                handleSSSearch(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page Number Buttons
        const startPage = Math.max(0, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerHTML = i + 1;
            pageButton.className = `flex items-center justify-center p-5 h-8 text-sm font-medium ${
                i === currentPage
                    ? 'bg-gray-900 text-white p-5'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white'
            }`;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                handleSSSearch(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('button2');
        nextButton.innerHTML = 'Next→';
        nextButton.className = 'flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
        nextButton.disabled = currentPage === totalPages - 1; // Disable if on the last page
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                currentPage++;
                handleSSSearch(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

// Function to create a pagination container
    function createSSSPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination2';
        container.className = 'flex items-center mt-5 justify-center';
        document.getElementById('SuggestedList').parentNode.appendChild(container);
        return container;
    }
    handleSearch();
    handleSSearch();
    handleSSSearch();

});



