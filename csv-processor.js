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
        const tableName = guest.table_name || `Table ${tableId}`;
        
        if (!tablesMap[tableId]) {
            tablesMap[tableId] = {
                id: tableId,
                name: tableName,
                // Positions will be set in the custom layout function
                x: 0,
                y: 0,
                size: 60, // Slightly smaller to fit more tables
                guests: []
            };
        }
        
        // Add this guest to the table's guest list
        tablesMap[tableId].guests.push({
            name: guest.name,
            table: tableId,
            seat: guest.seat ? parseInt(guest.seat) : null,
            vietnamese_name: guest.vietnamese_name || null,
            side: guest.side || 'bride' // Default to bride's side if not specified
        });
    });
    
    // Extract the tables as an array
    const tables = Object.values(tablesMap);
    
    // Apply custom layout based on the Table Seating Chart document
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
                y: 80,
                width: 500,
                height: 70,
                label: 'Stage'
            },
            // Bride and groom area
            {
                type: 'rectangle',
                name: 'brideGroom',
                x: 500,
                y: 180,
                width: 200,
                height: 60,
                label: 'Bride and Groom'
            },
            // Dance Floor
            {
                type: 'rectangle',
                name: 'danceFloor',
                x: 500,
                y: 340,
                width: 200,
                height: 150,
                label: 'Dance Floor'
            },
            // Cake area
            {
                type: 'rectangle',
                name: 'cake',
                x: 700,
                y: 180,
                width: 100,
                height: 60,
                label: 'Cake'
            },
            // Bar area
            {
                type: 'rectangle',
                name: 'bar',
                x: 150,
                y: 180,
                width: 100,
                height: 60,
                label: 'Bar'
            },
            // Gifts area
            {
                type: 'rectangle',
                name: 'gifts',
                x: 300,
                y: 560,
                width: 100,
                height: 60,
                label: 'Gifts'
            },
            // VIP Table
            {
                type: 'rectangle',
                name: 'vipTable',
                x: 500,
                y: 560,
                width: 150,
                height: 60,
                label: 'VIP Table'
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
                vietnamese_name: guest.vietnamese_name,
                side: guest.side
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
    // Define table positions according to the document
    const tablePositions = {
        // Row 1 (top row - tables 1-7)
        1: { x: 200, y: 150 },
        2: { x: 300, y: 150 },
        3: { x: 400, y: 150 },
        4: { x: 600, y: 150 },
        5: { x: 700, y: 150 },
        6: { x: 800, y: 150 },
        7: { x: 900, y: 150 },
        
        // Row 2 (tables 8-14)
        8: { x: 200, y: 230 },
        9: { x: 300, y: 230 },
        10: { x: 400, y: 230 },
        11: { x: 600, y: 230 },
        12: { x: 700, y: 230 },
        13: { x: 800, y: 230 },
        14: { x: 900, y: 230 },
        
        // Row 3 (tables 15-21)
        15: { x: 200, y: 310 },
        16: { x: 300, y: 310 },
        17: { x: 400, y: 310 },
        18: { x: 600, y: 310 },
        19: { x: 700, y: 310 },
        20: { x: 800, y: 310 },
        21: { x: 900, y: 310 },
        
        // Row 4 (tables 22-28)
        22: { x: 200, y: 390 },
        23: { x: 300, y: 390 },
        24: { x: 400, y: 390 },
        25: { x: 600, y: 390 },
        26: { x: 700, y: 390 },
        27: { x: 800, y: 390 },
        28: { x: 900, y: 390 },
        
        // Row 5 (tables 29-33)
        29: { x: 200, y: 470 },
        30: { x: 300, y: 470 },
        31: { x: 400, y: 470 },
        32: { x: 600, y: 470 },
        33: { x: 700, y: 470 },
        
        // Right side extra tables (34-37)
        34: { x: 800, y: 470 },
        35: { x: 900, y: 470 },
        36: { x: 800, y: 550 },
        37: { x: 900, y: 550 },
        
        // Bottom side extra tables (38-41)
        38: { x: 800, y: 630 },
        39: { x: 900, y: 630 },
        40: { x: 800, y: 710 },
        41: { x: 900, y: 710 },
        
        // Left side extra tables (42-45)
        42: { x: 200, y: 630 },
        43: { x: 300, y: 630 },
        44: { x: 200, y: 710 },
        45: { x: 300, y: 710 }
    };
    
    // Apply positions to tables
    tables.forEach(table => {
        const position = tablePositions[table.id];
        if (position) {
            table.x = position.x;
            table.y = position.y;
        } else {
            // For any tables not in our defined positions (extras beyond 45),
            // place them along the bottom
            const extraIndex = table.id - 45;
            table.x = 400 + (extraIndex * 80);
            table.y = 710;
        }
    });
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
    // Other initialization as needed
    console.log('UI initialized successfully.');
}

// Call this function when the document is loaded
// (This will be called from script.js)
