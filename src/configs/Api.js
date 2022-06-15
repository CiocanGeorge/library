const base = "https://localhost:7002/api/v1/";
const routes = {
    books: {
        addBook: "Books/addBook",
        getAll: "Books/viewAllBooks",
        getBook: (id) => `Books/viewStatusAboutBook/${id}`,
        deleteBook: (id) => `Books/deleteBook/${id}`,
    },
    metrics: {
        getBook: (id) => `Metrics/metricsAboutBook/${id}`,
    },
    rentals: {
        rentBook: "Rentals/rentBook",
        myRentals: "Rentals/viewMyRentals",
        returnBook: (id) => `Rentals/returnBook/${id}`,
    },
    profile: {
        setupProfile: "Profiles/registerProfile",
        getProfile: "Profiles/viewProfile",
    },
};

export { base, routes };