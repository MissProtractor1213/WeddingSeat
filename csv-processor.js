// This script processes the CSV guest list and generates the data structures needed for the application

// Helper function to parse CSV content
function parseCSV(csvContent) {
    // Split the content into lines
    const lines = csvContent.split(/\r\n|\n/);
    
    // Extract the headers
    const headers = lines[0].split(',');
    
    // Parse each line
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        // Skip empty lines
        if (lines[i].trim() === '') continue;
        
        const obj = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j].trim();
        }
        
        result.push(obj);
    }
    
    return result;
}

// Function to process the CSV data and generate the venue layout and guest list
function processGuestData(csvContent) {
    // Parse the CSV content
    const rawGuests = parseCSV(csvContent);
    
    // Extract unique tables
    const tablesMap = {};
    
    rawGuests.forEach(guest => {
        const tableId = parseInt(guest.table_id);
        const tableName = guest.table_name;
        
        if (!tablesMap[tableId]) {
            tablesMap[tableId] = {
                id: tableId,
                name: tableName,
                // Positions will be set in the custom layout function
                x: 0,
                y: 0,
                size: 70, // Slightly smaller to fit more tables
                guests: []
            };
        }
        
        // Add this guest to the table's guest list
        tablesMap[tableId].guests.push({
            name: guest.name,
            table: tableId,
            seat: guest.seat ? parseInt(guest.seat) : null,
            vietnamese_name: guest.vietnamese_name || null
        });
    });
    
    // Extract the tables as an array
    const tables = Object.values(tablesMap);
    
    // Apply custom layout based on document page 4
    arrangeTablesInCustomLayout(tables);
    
    // Create the venue layout
    const venueLayout = {
        width: 1000,
        height: 800,
        fixedElements: [
            // Stage at the top
            {
                type: 'rectangle',
                name: 'stage',
                x: 500,
                y: 50,
                width: 600,
                height: 80,
                label: 'Stage'
            },
            // Bride and groom area
            {
                type: 'rectangle',
                name: 'brideGroom',
                x: 350,
                y: 150,
                width: 150,
                height: 60,
                label: 'Bride and Groom'
            },
            // Cake and gifts area
            {
                type: 'rectangle',
                name: 'cakeGifts',
                x: 650,
                y: 150,
                width: 150,
                height: 60,
                label: 'Cake & Gifts'
            },
            // Bar area on right side
            {
                type: 'rectangle',
                name: 'bar',
                x: 900,
                y: 400,
                width: 60,
                height: 200,
                label: 'BAR'
            },
            // VIP table
            {
                type: 'rectangle',
                name: 'vipTable',
                x: 200,
                y: 400,
                width: 120,
                height: 80,
                label: 'VIP Table'
            },
            // Dance floor in center
            {
                type: 'rectangle',
                name: 'danceFloor',
                x: 500,
                y: 400,
                width: 200,
                height: 180,
                label: 'Dance Floor'
            }
        ],
        tables: tables
    };
    
    // Create the guest list
    const guestList = [];
    
    tables.forEach(table => {
        table.guests.forEach(guest => {
            guestList.push({
                name: guest.name,
                table: guest.table,
                tableObject: table,
                seat: guest.seat,
                vietnamese_name: guest.vietnamese_name
            });
        });
    });
    
    return {
        venueLayout: venueLayout,
        guestList: guestList
    };
}

// Function to arrange tables in a custom layout based on the document
function arrangeTablesInCustomLayout(tables) {
    const numTables = tables.length;
    
    // Define table positions based on the floor plan in the document
    // This mimics the layout of 45 round tables from page 4
    
    // Cluster 1: Top left tables (6 tables in 2 rows of 3)
    for (let i = 0; i < 6 && i < numTables; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        tables[i].x = 150 + col * 120;
        tables[i].y = 220 + row * 120;
    }
    
    // Cluster 2: Top right tables (6 tables in 2 rows of 3)
    for (let i = 6; i < 12 && i < numTables; i++) {
        const col = (i - 6) % 3;
        const row = Math.floor((i - 6) / 3);
        tables[i].x = 650 + col * 120;
        tables[i].y = 220 + row * 120;
    }
    
    // Cluster 3: Left side of dance floor (4 tables)
    for (let i = 12; i < 16 && i < numTables; i++) {
        tables[i].x = 300;
        tables[i].y = 320 + (i - 12) * 100;
    }
    
    // Cluster 4: Right side of dance floor (4 tables)
    for (let i = 16; i < 20 && i < numTables; i++) {
        tables[i].x = 700;
        tables[i].y = 320 + (i - 16) * 100;
    }
    
    // Cluster 5: Bottom left (6 tables in 2 rows of 3)
    for (let i = 20; i < 26 && i < numTables; i++) {
        const col = (i - 20) % 3;
        const row = Math.floor((i - 20) / 3);
        tables[i].x = 150 + col * 120;
        tables[i].y = 580 + row * 120;
    }
    
    // Cluster 6: Bottom center (4 tables in 2 rows of 2)
    for (let i = 26; i < 30 && i < numTables; i++) {
        const col = (i - 26) % 2;
        const row = Math.floor((i - 26) / 2);
        tables[i].x = 450 + col * 100;
        tables[i].y = 580 + row * 120;
    }
    
    // Cluster 7: Bottom right (6 tables in 2 rows of 3)
    for (let i = 30; i < 36 && i < numTables; i++) {
        const col = (i - 30) % 3;
        const row = Math.floor((i - 30) / 3);
        tables[i].x = 650 + col * 120;
        tables[i].y = 580 + row * 120;
    }
    
    // Cluster 8: Far left (3 tables in 1 column)
    for (let i = 36; i < 39 && i < numTables; i++) {
        tables[i].x = 80;
        tables[i].y = 320 + (i - 36) * 120;
    }
    
    // Cluster 9: Far right (3 tables in 1 column)
    for (let i = 39; i < 42 && i < numTables; i++) {
        tables[i].x = 820;
        tables[i].y = 320 + (i - 39) * 120;
    }
    
    // Remaining tables (if any) placed at the bottom
    for (let i = 42; i < numTables; i++) {
        tables[i].x = 300 + ((i - 42) % 5) * 100;
        tables[i].y = 720;
    }
}

// This function loads the CSV file and initializes the data
async function initializeFromCSV() {
    try {
        // Fetch the CSV file
        const response = await fetch('guests.csv');
        const csvContent = await response.text();
        
        // Process the CSV data
        const data = processGuestData(csvContent);
        
        // Store the generated data in global variables
        window.venueLayout = data.venueLayout;
        window.guestList = data.guestList;
        
        // Log success message
        console.log(`Successfully loaded ${data.guestList.length} guests at ${data.venueLayout.tables.length} tables.`);
        
        // Initialize the UI now that we have the data
        initializeUI();
    } catch (error) {
        console.error('Error loading guest data:', error);
        document.getElementById('errorMessage').textContent = 'Failed to load guest data. Please try refreshing the page.';
        document.getElementById('errorMessage').classList.remove('hidden');
    }
}

// A simplified UI initialization function (replace with your actual initialization)
function initializeUI() {
    // Initialize the venue map
    initializeVenueMap();
    
    // Other initialization as needed
    console.log('UI initialized successfully.');
}

// This would get called by your main script
// initializeFromCSV();
