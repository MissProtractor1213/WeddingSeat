// This updates the searchGuest function in script.js to ensure proper table highlighting

function searchGuest() {
    console.log("Search function called");
    
    // Check if guest list exists
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
    const nameSearchInput = document.getElementById('nameSearch');
    const searchName = nameSearchInput.value.trim().toLowerCase();
    
    // Get the selected side
    const selectedSide = document.querySelector('input[name="side"]:checked').value;
    
    console.log(`Searching for "${searchName}" on "${selectedSide}" side`);
    
    // Log the guest list for debugging
    console.log("Available guests:", window.guestList.map(g => g.name));
    
    // Hide previous results
    const resultContainer = document.getElementById('resultContainer');
    const noResultContainer = document.getElementById('noResultContainer');
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
        const guestNameElement = document.getElementById('guestName');
        
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
            const message = window.currentLanguage === 'en' 
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

function displayGuestInfo(guest) {
    // Set guest name and table information
    const guestNameElement = document.getElementById('guestName');
    const tableNameElement = document.getElementById('tableName');
    const seatNumberElement = document.getElementById('seatNumber');
    const tablematesListElement = document.getElementById('tablematesList');
    const resultContainer = document.getElementById('resultContainer');
    
    guestNameElement.textContent = guest.name;
    tableNameElement.textContent = guest.tableObject ? guest.tableObject.name : `Table ${guest.table}`;
    
    // Set seat number if available
    if (guest.seat) {
        seatNumberElement.textContent = getSeatNumberText(guest.seat, window.currentLanguage);
    } else {
        seatNumberElement.textContent = '';
    }
    
    // Display tablemates
    displayTablemates(guest);
    
    // Enhanced table highlighting
    highlightTable(guest.table);
    
    // Show the result container
    resultContainer.classList.remove('hidden');
    
    // Log success message
    console.log(`Successfully displayed info for ${guest.name} at Table ${guest.table}`);
}

function highlightTable(tableId) {
    console.log("Highlighting table:", tableId);
    
    // Remove highlight from all tables
    document.querySelectorAll('.table').forEach(table => {
        table.classList.remove('highlighted');
    });
    
    // Add highlight to the selected table
    const tableElement = document.getElementById(`table-${tableId}`);
    if (tableElement) {
        // Add the highlighted class to make the table stand out
        tableElement.classList.add('highlighted');
        
        // Ensure the venue map is visible
        const venueMap = document.getElementById('venueMap');
        if (venueMap && venueMap.classList.contains('hidden')) {
            venueMap.classList.remove('hidden');
        }
        
        // Scroll to make sure the table is visible with smooth scrolling
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log(`Table ${tableId} highlighted successfully`);
    } else {
        console.error(`Table element with ID table-${tableId} not found in the DOM`);
        
        // Try to regenerate the venue map if table wasn't found
        if (typeof window.initializeVenueMap === 'function') {
            console.log('Attempting to reinitialize venue map');
            window.initializeVenueMap();
            
            // Try highlighting again after a short delay
            setTimeout(() => {
                const tableElement = document.getElementById(`table-${tableId}`);
                if (tableElement) {
                    tableElement.classList.add('highlighted');
                    tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    console.log(`Table ${tableId} highlighted after reinitialization`);
                }
            }, 200);
        }
    }
}
