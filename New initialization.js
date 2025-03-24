// This file ensures proper initialization of the wedding seating chart application

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting application initialization');
    
    // Check if the initializeFromCSV function exists
    if (typeof window.initializeFromCSV === 'function') {
        // Call the initialization function
        window.initializeFromCSV()
            .then(success => {
                if (success) {
                    console.log('Application successfully initialized');
                } else {
                    console.error('Application initialization failed');
                }
            })
            .catch(error => {
                console.error('Error during application initialization:', error);
                // Show error message to user
                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent = `Failed to initialize application: ${error.message}`;
                    errorMessage.classList.remove('hidden');
                }
            });
    } else {
        console.error('initializeFromCSV function not found!');
        // Show error message to user
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = 'Failed to initialize application: Required functions not found';
            errorMessage.classList.remove('hidden');
        }
    }
    
    // Add a function to retry initialization
    window.retryInitialization = function() {
        console.log('Retrying initialization...');
        
        // Hide error message
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
        
        // Try to initialize again
        if (typeof window.initializeFromCSV === 'function') {
            window.initializeFromCSV();
        } else {
            console.error('Retry failed: initializeFromCSV function not found');
            if (errorMessage) {
                errorMessage.textContent = 'Retry failed: Required functions not found';
                errorMessage.classList.remove('hidden');
            }
        }
    };
    
    // Add retry button functionality if it exists
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', window.retryInitialization);
    }
});
