// This file ensures proper initialization of the wedding seating chart application

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting application initialization');
    
    // ADDED: Display loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'loadingMessage';
    loadingMessage.style.padding = '15px';
    loadingMessage.style.backgroundColor = '#f8f9fa';
    loadingMessage.style.border = '1px solid #ddd';
    loadingMessage.style.borderRadius = '5px';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.margin = '20px auto';
    loadingMessage.style.maxWidth = '400px';
    loadingMessage.innerHTML = '<p>Loading guest data... Please wait.</p>';
    
    // Add it after the header
    const headerElement = document.querySelector('header');
    if (headerElement && headerElement.parentNode) {
        headerElement.parentNode.insertBefore(loadingMessage, headerElement.nextSibling);
    } else {
        // Fallback to adding at the beginning of body
        document.body.insertBefore(loadingMessage, document.body.firstChild);
    }
    
    // ADDED: Function to handle initialization success
    function onInitializationSuccess() {
        console.log('Application successfully initialized');
        
        // Remove loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
        
        // Update UI elements to show everything is ready
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.disabled = false;
        }
        
        // Log some stats for debugging
        if (window.guestList && Array.isArray(window.guestList)) {
            console.log(`Loaded ${window.guestList.length} guests`);
            console.log('Sample guests:', window.guestList.slice(0, 3));
        }
        
        if (window.venueLayout && window.venueLayout.tables) {
            console.log(`Loaded ${window.venueLayout.tables.length} tables`);
        }
    }
    
    // ADDED: Function to handle initialization failure
    function onInitializationFailure(error) {
        console.error('Application initialization failed:', error);
        
        // Remove loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
        
        // Show error message to user
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = `Failed to initialize application: ${error.message}`;
            errorMessage.classList.remove('hidden');
        }
    }
    
    // Check if the initializeFromCSV function exists
    if (typeof window.initializeFromCSV === 'function') {
        // Call the initialization function
        window.initializeFromCSV()
            .then(success => {
                if (success) {
                    onInitializationSuccess();
                } else {
                    onInitializationFailure(new Error('Initialization returned false'));
                }
            })
            .catch(error => {
                onInitializationFailure(error);
            });
    } else {
        console.error('initializeFromCSV function not found!');
        
        // ADDED: Check if we should attempt to load script dynamically
        const scriptElement = document.createElement('script');
        scriptElement.src = 'csv-processor.js';
        scriptElement.onload = function() {
            console.log('Dynamically loaded csv-processor.js');
            if (typeof window.initializeFromCSV === 'function') {
                window.initializeFromCSV()
                    .then(onInitializationSuccess)
                    .catch(onInitializationFailure);
            } else {
                onInitializationFailure(new Error('initializeFromCSV function still not found after loading script'));
            }
        };
        scriptElement.onerror = function() {
            onInitializationFailure(new Error('Failed to load csv-processor.js dynamically'));
        };
        document.head.appendChild(scriptElement);
    }
    
    // Add a function to retry initialization
    window.retryInitialization = function() {
        console.log('Retrying initialization...');
        
        // Hide error message
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
        
        // Show loading message again
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }
        
        // Try to initialize again
        if (typeof window.initializeFromCSV === 'function') {
            window.initializeFromCSV()
                .then(success => {
                    if (success) {
                        onInitializationSuccess();
                    } else {
                        onInitializationFailure(new Error('Retry initialization returned false'));
                    }
                })
                .catch(error => {
                    onInitializationFailure(error);
                });
        } else {
            console.error('Retry failed: initializeFromCSV function not found');
            onInitializationFailure(new Error('Required functions not found for retry'));
        }
    };
    
    // Add retry button functionality if it exists
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', window.retryInitialization);
    }
});
