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

// Add an event listener to check when the search button is clicked
document.getElementById('searchButton').addEventListener('click', function() {
  console.log("Search button clicked");
  console.log("Search input value:", document.getElementById('nameSearch').value);
  console.log("Selected side:", document.querySelector('input[name="side"]:checked').value);
  console.log("Guest list loaded:", window.guestList ? window.guestList.length + " guests" : "No guest list found");
  
  if (window.guestList && window.guestList.length > 0) {
    console.log("First few guests:", window.guestList.slice(0, 3));
  }
});
    
    // Set initial active language button
    updateLanguageButtonState();
    
    // Add event listeners
    searchButton.addEventListener('click', searchGuest);
    nameSearchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchGuest();
        }
    });
    
    // Back button functionality
    backButton.addEventListener('click', function() {
        resultContainer.classList.add('hidden');
        nameSearchInput.value = '';
    });
    
    // Try again button functionality
    tryAgainButton.addEventListener('click', function() {
        noResultContainer.classList.add('hidden');
        nameSearchInput.value = '';
        nameSearchInput.focus();
    });
    
    // Add language button event listeners
    englishBtn.addEventListener('click', function() {
        setLanguage('en');
    });
    
    vietnameseBtn.addEventListener('click', function() {
        setLanguage('vi');
    });
    
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
    
    function searchGuest() {
        // Get the search input and normalize it
        const searchName = nameSearchInput.value.trim().toLowerCase();
        
        // Get the selected side
        const selectedSide = document.querySelector('input[name="side"]:checked').value;
        
        // Hide previous results
        resultContainer.classList.add('hidden');
        noResultContainer.classList.add('hidden');
        
        // Don't search if input is empty
        if (!searchName) {
            return;
        }
        
        // Find the guest in our data, taking the side into account
        const guest = findGuest(searchName, selectedSide);
        
        if (guest) {
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
        
        // First try an exact match
        const exactMatch = window.guestList.find(guest => 
            guest.side === side && (
                guest.name.toLowerCase() === searchName ||
                (guest.vietnamese_name && guest.vietnamese_name.toLowerCase() === searchName)
            )
        );
        
        if (exactMatch) {
            return exactMatch;
        }
        
        // Then try partial matches
        const partialMatch = window.guestList.find(guest => 
            guest.side === side && (
                guest.name.toLowerCase().includes(searchName) ||
                searchName.includes(guest.name.toLowerCase()) ||
                (guest.vietnamese_name && guest.vietnamese_name.toLowerCase().includes(searchName)) ||
                (guest.vietnamese_name && searchName.includes(guest.vietnamese_name.toLowerCase()))
            )
        );
        
        if (partialMatch) {
            return partialMatch;
        }
        
        // If no exact or partial match, try fuzzy matching
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
            
            // Update the best match if this score is better
            if (bestGuestScore > bestScore) {
                bestScore = bestGuestScore;
                bestMatch = guest;
            }
        });
        
        // Only return a match if the similarity is above a threshold (0.6 or 60% similar)
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
    
    // The missing displayGuestInfo function 
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
    
    function initializeVenueMap() {
        // Ensure venue layout exists
        if (!window.venueLayout) {
            console.error('Venue layout is not initialized');
            return;
        }
        
        // Clear any existing elements
        venueMapElement.innerHTML = '';
        
        // Set the map dimensions based on the container
        const mapWidth = venueMapElement.offsetWidth;
        const mapHeight = venueMapElement.offsetHeight;
        
        // Calculate scaling factors
        const scaleX = mapWidth / window.venueLayout.width;
        const scaleY = mapHeight / window.venueLayout.height;
        
        // Draw fixed elements (if any)
        if (window.venueLayout.fixedElements) {
            window.venueLayout.fixedElements.forEach(element => {
                const elementDiv = document.createElement('div');
                elementDiv.className = 'fixed-element';
                elementDiv.style.left = `${element.x * scaleX - (element.width * scaleX / 2)}px`;
                elementDiv.style.top = `${element.y * scaleY - (element.height * scaleY / 2)}px`;
                elementDiv.style.width = `${element.width * scaleX}px`;
                elementDiv.style.height = `${element.height * scaleY}px`;
                
                // Special styling for specific elements
                if (element.name === 'danceFloor') {
                    elementDiv.style.backgroundColor = '#f0e6ff';
                    elementDiv.style.border = '2px dashed #9966cc';
                } else if (element.name === 'stage') {
                    elementDiv.style.backgroundColor = '#e6f7ff';
                    elementDiv.style.border = '2px solid #66b3cc';
                } else if (element.name === 'bar') {
                    elementDiv.style.backgroundColor = '#e6ffe6';
                    elementDiv.style.border = '2px solid #66cc66';
                    elementDiv.style.fontWeight = 'bold';
                } else if (element.name === 'vipTable') {
                    elementDiv.style.backgroundColor = '#fff0f0';
                    elementDiv.style.border = '2px solid #cc6666';
                }
                
                // Set the label based on language
                const labelKey = element.name + '-label';
                if (translations[currentLanguage] && translations[currentLanguage][labelKey]) {
                    elementDiv.textContent = translations[currentLanguage][labelKey];
                } else {
                    elementDiv.textContent = element.label;
                }
                
                venueMapElement.appendChild(elementDiv);
            });
        }
        
        // Draw tables
        window.venueLayout.tables.forEach(table => {
            const tableDiv = document.createElement('div');
            tableDiv.className = 'table';
            tableDiv.id = `table-${table.id}`;
            tableDiv.style.left = `${table.x * scaleX - (table.size * scaleX / 2)}px`;
            tableDiv.style.top = `${table.y * scaleY - (table.size * scaleY / 2)}px`;
            tableDiv.style.width = `${table.size * scaleX}px`;
            tableDiv.style.height = `${table.size * scaleY}px`;
            tableDiv.textContent = `${table.id}: ${table.name}`;
            venueMapElement.appendChild(tableDiv);
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
        }
    }
    
    // Initialize the data from CSV, then set up the UI
    initializeFromCSV();
    
    // Apply translations initially
    applyTranslations();
});
