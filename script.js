document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const nameSearchInput = document.getElementById('nameSearch');
    const searchButton = document.getElementById('searchButton');
    const resultContainer = document.getElementById('resultContainer');
    const noResultContainer = document.getElementById('noResultContainer');
    const guestNameElement = document.getElementById('guestName');
    const tableNameElement = document.getElementById('tableName');
    const seatNumberElement = document.getElementById('seatNumber');
    const tablematesListElement = document.getElementById('tablematesList');
    const venueMapElement = document.getElementById('venueMap');
    const englishBtn = document.getElementById('englishBtn');
    const vietnameseBtn = document.getElementById('vietnameseBtn');
    const backButton = document.getElementById('backButton');
    const tryAgainButton = document.getElementById('tryAgainButton');

    // Set default language as a global variable
    window.currentLanguage = 'en';

    // Check if there's a saved language preference in localStorage
    if (localStorage.getItem('weddinglanguage')) {
        window.currentLanguage = localStorage.getItem('weddinglanguage');
    }

    // Add this logging code to check if data is loading
    console.log("DOM fully loaded");

    // Add event listeners
    if (searchButton) {
        searchButton.addEventListener('click', searchGuest);
        console.log("Search button event listener added");
    } else {
        console.error("Search button not found in the DOM");
    }

    if (nameSearchInput) {
        nameSearchInput.addEventListener('keyup', function(event
