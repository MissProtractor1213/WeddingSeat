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
    
    // Set default language
    let currentLanguage = 'en';
    
    // Check if there's a saved language preference in localStorage
    if (localStorage.getItem('weddinglanguage')) {
        currentLanguage = localStorage.getItem('weddinglanguage');
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
        nameSearchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchGuest();
            }
        });
        console.log("Search input event listener added");
    } else {
        console.error("Search input not found in the DOM");
    }
    
    // Back button functionality
    if (backButton) {
        backButton.addEventListener('click', function() {
            resultContainer.classList.add('hidden');
            nameSearchInput.value = '';
        });
        console.log("Back button event listener added");
    }
    
    // Try again button functionality
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function() {
            noResultContainer.classList.add('hidden');
            nameSearchInput.value = '';
            nameSearchInput.focus();
        });
        console.log("Try again button event listener added");
    }
    
    // Add language button event listeners
    if (englishBtn) {
        englishBtn.addEventListener('click', function() {
            setLanguage('en');
        });
        console.log("English button event listener added");
    }
    
    if (vietnameseBtn) {
        vietnameseBtn.addEventListener('click', function() {
            setLanguage('vi');
        });
        console.log("Vietnamese button event listener added");
    }
    
    // Function to set language
    function setLanguage(lang) {
        currentLanguage = lang;
        
        // Save language preference to localStorage
        localStorage.setItem('weddinglanguage', currentLanguage);
        
        // Update the language button state
        updateLanguageButtonState();
        
        // Apply translations
        applyTranslations();
    }
    
    // Function to update language button state
    function updateLanguageButtonState() {
        if (currentLanguage === 'en') {
            englishBtn.classList.add('active');
            vietnameseBtn.classList.remove('active');
        } else {
            vietnameseBtn.classList.add('active');
            englishBtn.classList.remove('active');
        }
    }
    
    // Set initial active language button
    updateLanguageButtonState();
    
    // Function to apply translations to all elements
    function applyTranslations() {
        // Get all elements with the data-lang-key attribute
        const elements = document.querySelectorAll('[data-lang-key]');
        
        // Update each element with the corresponding translation
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            
            // Handle input placeholders separately
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[currentLanguage][key];
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        });
        
        // Update any dynamic content that's currently visible
        if (!resultContainer.classList.contains('hidden') && seatNumberElement.textContent) {
            const seatNumberMatch = seatNumberElement.textContent.match(/\d+/);
            if (seatNumberMatch) {
                const seatNumber = seatNumberMatch[0];
                seatNumberElement.textContent = getSeatNumberText(seatNumber, currentLanguage);
            }
        }
    }
    
    // Make the applyTranslations function globally available
    window.applyTranslations = applyTranslations;
    
    function searchGuest() {
        console.log("Search function called");
        
        // ADDED DEBUG: Check if guest list exists
        if (!window.guestList || !Array.isArray(window.guestList) || window.guestList.length === 0) {
            console.error("Guest list is not properly loaded. Current value:", window.guestList);
            const errorMsg = document.getElementById('errorMessage');
            if (errorMsg) {
                errorMsg.textContent = "Error: Guest list not loaded. Please try refreshing the page.";
                errorMsg.classList.remove('hidden');
            }
            return;
        }
        
        // Get the search input and normalize it
        const searchName = nameSearchInput.value.trim().toLowerCase();
        
        // Get the selected side
        const selectedSide = document.querySelector('input[name="side"]:checked').value;
        
        console.log(`Searching for "${searchName}" on "${selectedSide}" side`);
        
        // ADDED DEBUG: Log the guest list for debugging
        console.log("Available guests:", window.guestList.map(g => g.name));
        
        // Hide previous results
        resultContainer.classList.add('hidden');
        noResultContainer.classList.add('hidden');
        
        // Don't search if input is empty
        if (!searchName) {
            console.log("Search input is empty");
            return;
        }
        
        // Find the guest in our data, taking the side into account
        const guest = findGuest(searchName, selectedSide);
        
        if (guest) {
            console.log("Guest found:", guest);
            // Display guest information
            displayGuestInfo(guest);
            
            // If the search name doesn't exactly match the name, show a message
            const guestNameLower = guest.name.toLowerCase();
            const vietnameseLower = guest.vietnamese_name ? guest.vietnamese_name.toLowerCase() : '';
            
            if (guestNameLower !== searchName && vietnameseLower !== searchName) {
                // Create or update a fuzzy match notice
                let fuzzyNotice = document.getElementById('fuzzyMatchNotice');
                
                if (!fuzzyNotice) {
                    fuzzyNotice = document.createElement('p');
                    fuzzyNotice.id = 'fuzzyMatchNotice';
                    fuzzyNotice.style.fontStyle = 'italic';
                    fuzzyNotice.style.marginTop = '10px';
                    fuzzyNotice.style.fontSize = '0.9rem';
                    fuzzyNotice.style.color = '#666';
                    
                    // Insert it after the guest name
                    guestNameElement.parentNode.insertBefore(fuzzyNotice, guestNameElement.nextSibling);
                }
                
                // Set the message based on language
                const message = currentLanguage === 'en' 
                    ? `Showing closest match for "${nameSearchInput.value}"`
                    : `Hiển thị kết quả gần nhất cho "${nameSearchInput.value}"`;
                
                fuzzyNotice.textContent = message;
            } else {
                // Remove any existing fuzzy match notice
                const fuzzyNotice = document.getElementById('fuzzyMatchNotice');
                if (fuzzyNotice) {
                    fuzzyNotice.remove();
                }
            }
        } else {
            console.log("Guest not found");
            // Show no result message
            noResultContainer.classList.remove('hidden');
        }
    }

    function findGuest(searchName, side) {
        // Make sure guestList exists
        if (!window.guestList || !Array.isArray(window.guestList)) {
            console.error('Guest list is not properly initialized');
            return null;
        }
        
        console.log(`Finding guest: name="${searchName}", side="${side}"`);
        
        // IMPROVEMENT: Make search more robust by trimming spaces, handling special characters, etc.
        const normalizedSearchName = searchName.toLowerCase().trim();
        
        // First try an exact match
        const exactMatch = window.guestList.find(guest => {
            const guestNameNormalized = guest.name.toLowerCase().trim();
            const vietnameseNameNormalized = guest.vietnamese_name ? guest.vietnamese_name.toLowerCase().trim() : '';
            
            return guest.side === side && (
                guestNameNormalized === normalizedSearchName ||
                vietnameseNameNormalized === normalizedSearchName
            );
        });
        
        if (exactMatch) {
            console.log("Found exact match:", exactMatch.name);
            return exactMatch;
        }
        
        // Then try partial matches
        const partialMatch = window.guestList.find(guest => {
            const guestNameNormalized = guest.name.toLowerCase().trim();
            const vietnameseNameNormalized = guest.vietnamese_name ? guest.vietnamese_name.toLowerCase().trim() : '';
            
            return guest.side === side && (
                guestNameNormalized.includes(normalizedSearchName) ||
                normalizedSearchName.includes(guestNameNormalized) ||
                vietnameseNameNormalized.includes(normalizedSearchName) ||
                normalizedSearchName.includes(vietnameseNameNormalized)
            );
        });
        
        if (partialMatch) {
            console.log("Found partial match:", partialMatch.name);
            return partialMatch;
        }
        
        // If no exact or partial match, try fuzzy matching
        console.log("No exact or partial match found, trying fuzzy matching");
        return findClosestMatch(searchName, side);
    }
    
    // Function to find the closest matching guest using fuzzy matching
    function findClosestMatch(searchName, side) {
        if (!window.guestList || !Array.isArray(window.guestList)) {
            return null;
        }
        
        // Filter guests by side
        const sideGuests = window.guestList.filter(guest => guest.side === side);
        
        // No guests on this side
        if (sideGuests.length === 0) {
            console.log(`No guests found on ${side} side`);
            return null;
        }
        
        let bestMatch = null;
        let bestScore = 0;
        
        // Calculate similarity score for each guest
        sideGuests.forEach(guest => {
            // Check similarity with English name
            const nameScore = calculateSimilarity(searchName, guest.name.toLowerCase());
            
            // Check similarity with Vietnamese name if available
            let vnNameScore = 0;
            if (guest.vietnamese_name) {
                vnNameScore = calculateSimilarity(searchName, guest.vietnamese_name.toLowerCase());
            }
            
            // Use the better score between English and Vietnamese names
            const bestGuestScore = Math.max(nameScore, vnNameScore);
            
            console.log(`Guest "${guest.name}" similarity score: ${bestGuestScore.toFixed(2)}`);
            
            // Update the best match if this score is better
            if (bestGuestScore > bestScore) {
                bestScore = bestGuestScore;
                bestMatch = guest;
            }
        });
        
        console.log(`Best match: ${bestMatch ? bestMatch.name : 'none'} with score ${bestScore.toFixed(2)}`);
        
        // Only return a match if the similarity is above a threshold (0.4 or 40% similar)
        return bestScore > 0.4 ? bestMatch : null;
    }
    
    // Function to calculate similarity between two strings (0 to 1)
    function calculateSimilarity(str1, str2) {
        // Simple implementation of Levenshtein distance for string similarity
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        // If the longer string is empty, both are empty strings
        if (longer.length === 0) {
            return 1.0;
        }
        
        // If the shorter string is empty, similarity is 0
        if (shorter.length === 0) {
            return 0.0;
        }
        
        // Create a matrix for dynamic programming approach
        const matrix = Array(shorter.length + 1).fill().map(() => Array(longer.length + 1).fill(0));
        
        // Fill the first row and column
        for (let i = 0; i <= shorter.length; i++) {
            matrix[i][0] = i;
        }
        
        for (let j = 0; j <= longer.length; j++) {
            matrix[0][j] = j;
        }
        
        // Fill the rest of the matrix
        for (let i = 1; i <= shorter.length; i++) {
            for (let j = 1; j <= longer.length; j++) {
                const cost = shorter.charAt(i - 1) === longer.charAt(j - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // deletion
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j - 1] + cost  // substitution
                );
            }
        }
        
        // Calculate similarity as 1 - (distance / longer string length)
        const distance = matrix[shorter.length][longer.length];
        return 1.0 - (distance / longer.length);
    }
    
    function displayGuestInfo(guest) {
        // Set guest name and table information
        guestNameElement.textContent = guest.name;
        tableNameElement.textContent = guest.tableObject.name;
        
        // Set seat number if available
        if (guest.seat) {
            seatNumberElement.textContent = getSeatNumberText(guest.seat, currentLanguage);
        } else {
            seatNumberElement.textContent = '';
        }
        
        // Display tablemates
        displayTablemates(guest);
        
        // Highlight the guest's table on the map
        highlightTable(guest.table);
        
        // Show the result container
        resultContainer.classList.remove('hidden');
    }
    
    function displayTablemates(guest) {
        // Clear previous tablemates
        tablematesListElement.innerHTML = '';
        
        // Make sure guestList exists
        if (!window.guestList || !Array.isArray(window.guestList)) {
            console.error('Guest list is not properly initialized');
            return;
        }
        
        // Find all guests at the same table
        const tablemates = window.guestList.filter(g => 
            g.table === guest.table && g.name !== guest.name
        );
        
        // Add each tablemate to the list
        tablemates.forEach(tablemate => {
            const li = document.createElement('li');
            li.textContent = tablemate.name;
            tablematesListElement.appendChild(li);
        });
    }
    
    function highlightTable(tableId) {
        // Remove highlight from all tables
        document.querySelectorAll('.table').forEach(table => {
            table.classList.remove('highlighted');
        });
        
        // Add highlight to the selected table
        const tableElement = document.getElementById(`table-${tableId}`);
        if (tableElement) {
            tableElement.classList.add('highlighted');
            
            // Scroll to make sure the table is visible
            tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.error(`Table element with ID table-${tableId} not found`);
        }
    }
    
    // Apply translations initially
    applyTranslations();
    
    // Add a console message to help debugging
    console.log("script.js fully loaded and initialized");
});
