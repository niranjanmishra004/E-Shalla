document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    let allBooks = [];
    
    // Initialize books data
    function initializeBooks() {
        const bookCards = document.querySelectorAll('.book-card');
        allBooks = Array.from(bookCards).map(card => {
            return {
                element: card,
                title: card.querySelector('.book-title')?.textContent.toLowerCase() || '',
                author: card.querySelector('.book-author')?.textContent.toLowerCase() || '',
                category: card.querySelector('.book-category')?.textContent.toLowerCase() || ''
            };
        });
    }
    
    // Perform search
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            // Show all books if search is empty
            showAllBooks();
            return;
        }
        
        // Filter books based on search query
        const filteredBooks = allBooks.filter(book => 
            book.title.includes(query) || 
            book.author.includes(query) || 
            book.category.includes(query)
        );
        
        // Hide all books first
        allBooks.forEach(book => {
            book.element.style.display = 'none';
        });
        
        // Show filtered books
        filteredBooks.forEach(book => {
            book.element.style.display = 'block';
        });
        
        // Show no results message if no books found
        showNoResultsMessage(filteredBooks.length === 0, query);
    }
    
    // Show all books
    function showAllBooks() {
        allBooks.forEach(book => {
            book.element.style.display = 'block';
        });
        removeNoResultsMessage();
    }
    
    // Show no results message
    function showNoResultsMessage(show, query) {
        removeNoResultsMessage();
        
        if (show) {
            const booksContainer = document.querySelector('.books-container');
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No books found</h3>
                    <p>Sorry, we couldn't find any books matching "${query}". Try searching with different keywords.</p>
                </div>
            `;
            booksContainer.appendChild(noResultsDiv);
        }
    }
    
    // Remove no results message
    function removeNoResultsMessage() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
    
    // Real-time search as user types
    function setupRealTimeSearch() {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch();
            }, 300); // Debounce search by 300ms
        });
    }
    
    // Event listeners
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Initialize everything
        initializeBooks();
        setupRealTimeSearch();
    }
    
    // Handle responsive menu animation
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
});
