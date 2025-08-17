document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    const searchInput = document.getElementById('search-input');
    const totalBooksSpan = document.getElementById('total-books');

    let books = [];
    let bookNumberCounter = 0;

    const loadBooks = () => {
        const storedBooks = localStorage.getItem('books');
        const storedCounter = localStorage.getItem('bookNumberCounter');
        if (storedBooks) {
            books = JSON.parse(storedBooks);
            displayBooks(books);
        }
        if (storedCounter) {
            bookNumberCounter = parseInt(storedCounter, 10);
        }
        updateBookCount();
    };

    const saveBooks = () => {
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('bookNumberCounter', bookNumberCounter);
        updateBookCount();
    };

    const updateBookCount = () => {
        totalBooksSpan.textContent = books.length;
    };

    const displayBooks = (bookArray) => {
        bookList.innerHTML = '';
        bookArray.forEach(book => {
            const li = document.createElement('li');
            li.className = 'book-item';
            li.dataset.id = book.isbn;
            if (book.isReturned) {
                li.classList.add('returned');
            }
            li.innerHTML = `
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p>By ${book.author}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <p>Book No: ${book.bookNumber}</p>
                    <p class="status">${book.isReturned ? 'Status: Returned' : 'Status: Borrowed'}</p>
                </div>
                <div>
                    <button class="return-btn">${book.isReturned ? 'Un-return' : 'Return'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            bookList.appendChild(li);
        });
    };

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;

        bookNumberCounter++;
        const newBook = { title, author, isbn, bookNumber: bookNumberCounter, isReturned: false };
        books.push(newBook);
        saveBooks();
        displayBooks(books);

        bookForm.reset();
    });

    bookList.addEventListener('click', (e) => {
        const bookItem = e.target.closest('.book-item');
        if (!bookItem) return;

        const isbn = bookItem.dataset.id;
        const bookIndex = books.findIndex(book => book.isbn === isbn);

        if (e.target.classList.contains('delete-btn')) {
            books.splice(bookIndex, 1);
            saveBooks();
            displayBooks(books);
        } else if (e.target.classList.contains('return-btn')) {
            books[bookIndex].isReturned = !books[bookIndex].isReturned;
            saveBooks();
            displayBooks(books);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm) ||
            String(book.bookNumber).includes(searchTerm)
        );
        displayBooks(filteredBooks);
    });

    loadBooks();
});