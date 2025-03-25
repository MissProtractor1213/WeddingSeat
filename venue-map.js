// Define the venue map initialization function in the global scope
window.initializeVenueMap = function() {
    console.log('initializeVenueMap called');
    
    // Ensure we have access to the translations and current language
    if (typeof window.currentLanguage === 'undefined') {
        window.currentLanguage = 'en';
        console.log('Setting default language in venue map');
    }
    
    // Ensure venue layout exists
    if (!window.venueLayout) {
        console.error('Venue layout is not initialized');
        return false;
    }
    
    // Get the venueMapElement
    const venueMapElement = document.getElementById('venueMap');
    if (!venueMapElement) {
        console.error('Venue map element not found');
        return false;
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
            if (translations[window.currentLanguage] && translations[window.currentLanguage][labelKey]) {
                elementDiv.textContent = translations[window.currentLanguage][labelKey];
            } else {
                elementDiv.textContent = element.label;
            }
            
            venueMapElement.appendChild(elementDiv);
        });
    }
    
    console.log(`Drawing ${window.venueLayout.tables.length} tables on venue map`);
    
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
    
    console.log('Map dimensions:', mapWidth, mapHeight);
    console.log('Number of tables drawn:', window.venueLayout.tables.length);
    if (window.venueLayout.tables.length > 0) {
        console.log('First table position:', window.venueLayout.tables[0].x, window.venueLayout.tables[0].y);
    }
    
    console.log('Venue map initialized with', window.venueLayout.tables.length, 'tables');
    return true;
};
