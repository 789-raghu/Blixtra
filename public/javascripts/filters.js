// script.js
let currentPage = 0;
const pageSize = 4;
let currentResults = null;
let totalPages = 0;
let searchTimeout = null;

// Simplified debounce function for form changes
function debounce(func, wait) {
    return function(...args) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => func(...args), wait);
    };
}

// Get form data from the UI
function getFormData() {
    const formData = {};
    const form = document.getElementById('schemeForm');
    const selects = form.querySelectorAll('select');

    selects.forEach(select => {
        if (select.value && select.value !== "gnhm" && select.value !== "fghytrdfghj") {
            formData[select.id] = select.value;
        }
    });

    return formData;
}

// Render the results to the UI
function renderResults(data) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    if (data?.length > 0) {
        const fragment = document.createDocumentFragment();

        data.forEach(scheme => {
            const listItem = document.createElement('li');
            const schemeName = scheme.fields.schemeName || 'No name available';
            const schemeDescription = scheme.fields.briefDescription || 'No description available';
            const beneficiaryState = scheme.fields.beneficiaryState?.join(', ') || 'No state available';
            const slug = scheme.fields.slug || '';

            const viewMoreLink = document.createElement('a');
            viewMoreLink.href = `https://www.myscheme.gov.in/schemes/${slug}`;
            viewMoreLink.className = 'view-more-link';
            viewMoreLink.textContent = 'View More >';

            listItem.innerHTML = `
                <strong>${schemeName}</strong><br>
                ${schemeDescription}<br>
                <em>State: ${beneficiaryState}</em><br>
            `;
            listItem.appendChild(viewMoreLink);
            fragment.appendChild(listItem);
        });

        resultsList.appendChild(fragment);
    } else {
        resultsList.innerHTML = '<li>No schemes found.</li>';
    }
}

// Render pagination controls
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination') || createPaginationContainer();
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    const fragment = document.createDocumentFragment();

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '←';
    prevButton.disabled = currentPage === 0;
    prevButton.onclick = () => handlePageChange(currentPage - 1);
    fragment.appendChild(prevButton);

    // Page numbers
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i + 1;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.onclick = () => handlePageChange(i);
        fragment.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '→';
    nextButton.disabled = currentPage === totalPages - 1;
    nextButton.onclick = () => handlePageChange(currentPage + 1);
    fragment.appendChild(nextButton);

    paginationContainer.appendChild(fragment);
}

function createPaginationContainer() {
    const container = document.createElement('div');
    container.id = 'pagination';
    // Tailwind classes for styling
    container.className = 'mt-5 flex gap-2 justify-center text-lg';
    document.getElementById('resultsList').parentNode.appendChild(container);
    return container;
}


// Handle page changes
async function handlePageChange(newPage) {
    if (newPage === currentPage) return;
    currentPage = newPage;
    await performSearch();
}

// Perform the actual search
async function performSearch() {
    try {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '<li>Loading...</li>';

        const formData = getFormData();
        const queryParams = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            queryParams.append(key, value);
        });
        queryParams.append('page', currentPage.toString());

        const response = await fetch(`/api/schemes?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        currentResults = data.results;
        totalPages = data.pagination.totalPages;

        renderResults(data.results);
        renderPagination(data.pagination.totalPages);

    } catch (error) {
        console.error("Error fetching schemes:", error);
        document.getElementById('resultsList').innerHTML =
            '<li class="error">Failed to fetch results. Please try again later.</li>';
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schemeForm');

    // Handle form changes
    form.addEventListener('change', debounce(() => {
        currentPage = 0;
        performSearch().then(r => console.log("Successful"));
    }, 500));

    // Initial search
    performSearch().then(r => console.log("Successful"));
});