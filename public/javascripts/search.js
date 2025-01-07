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
        handleSearch(); // Trigger a new request with updated filters
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

    // Check if we have cached data for the current page and render it
    const cachedResults = sessionStorage.getItem('cachedResults');
    if (cachedResults) {
        const cachedData = JSON.parse(cachedResults);
        currentResults = cachedData.results;
        totalPages = cachedData.totalPages;
        renderResults(currentResults);
        renderPagination(totalPages);
    }

    // Function to handle the search with filtering and pagination
    const handleSearch = async (page = 0) => {
        // Collect form values as query parameters
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

        if (ageRange) {
            const [min, max] = ageRange.split('-').map(Number);
            ageMin = min || null;
            ageMax = max || null;
        }

        const queryParams = [];
        if (maritalStatus) queryParams.push({ identifier: "maritalStatus", value: maritalStatus });
        if (disability) queryParams.push({ identifier: "disability", value: disability });
        if (caste) queryParams.push({ identifier: "caste", value: caste });
        if (gender && gender !== "All") queryParams.push({ identifier: "gender", value: gender });
        if (beneficiaryState && beneficiaryState !== "All") queryParams.push({ identifier: "beneficiaryState", value: beneficiaryState });
        if (ageMin !== null && ageMax !== null) {
            queryParams.push({ identifier: "age-general", min: ageMin, max: ageMax });
        }
        if (bpl) queryParams.push({ identifier: "isBpl", value: bpl });
        if (disabilityPercentage !== "fghytrdfghj") {
            disabilityMin = disabilityPercentage;
            disabilityMax = disabilityPercentage;
            queryParams.push({ identifier: "disabilityPercentage", min: disabilityMin, max: disabilityMax });
        }
        if (occupation !== "gnhm" && occupation !== "Al") queryParams.push({ identifier: "occupation", value: occupation });

        const queryParamsString = JSON.stringify(queryParams);
        const baseUrl = "https://api.myscheme.gov.in/search/v4/schemes";
        const from = page * pageSize;
        const url = `${baseUrl}?lang=en&q=${encodeURIComponent(queryParamsString)}&keyword=&sort=&from=${from}&size=5`;

        const headers = {
            "Accept": "application/json",
            "X-API-Key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
        };

        try {
            const response = await fetch(url, { headers });
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

            renderResults(currentResults);
            renderPagination(totalPages);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
    };

    // Function to render results
    function renderResults(data) {
        console.log(data);
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach(function (scheme) {
                const listItem = document.createElement('li');
                const schemeName = scheme.fields.schemeName || 'No name available';
                const schemeDescription = scheme.fields.briefDescription || 'No description available';
                const beneficiaryState = scheme.fields.beneficiaryState && scheme.fields.beneficiaryState.join(', ') || 'No state available';
                const slug = scheme.fields.slug || '';

                listItem.innerHTML = ` 
                    <strong>${schemeName}</strong><br>
                    ${schemeDescription}<br>
                    <em>State: ${beneficiaryState}</em><br>
                    <a href="https://www.myscheme.gov.in/schemes/${slug}" 
                       class="view-more-link">View More ></a>
                `;

                resultsList.appendChild(listItem);
            });
        } else {
            const noResultsMessage = document.createElement('li');
            noResultsMessage.innerHTML = 'No schemes found.';
            resultsList.appendChild(noResultsMessage);
        }
    }

    // Function to render pagination
    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination') || createPaginationContainer();
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                handleSearch(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerHTML = i + 1;
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                handleSearch(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '→';
        nextButton.disabled = currentPage === totalPages - 1;
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                currentPage++;
                handleSearch(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Function to create pagination container
    function createPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination';
        container.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; justify-content: center;';
        document.getElementById('resultsList').parentNode.appendChild(container);
        return container;
    }

    handleSearch();
});
