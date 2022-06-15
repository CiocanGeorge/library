import React, { useMemo, useState, useEffect, useCallback } from "react";
import BookCard from "../../components/BookCard";
import RentModal from "../../components/modals/RentModal";
import UserLayout from "../../utils/UserLayout";
import axiosInstance from "../../configs/Axios";
import { useAuth0 } from "@auth0/auth0-react";
import { routes } from "../../configs/Api";

const UserBooks = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [books, setBooks] = useState([]);
  const [currentTab, setTab] = useState("rented");
  const [openedModal, setOpenedModal] = useState(false);
  const [currentBook, setBook] = useState({ name: "" });

  const availableBooks = useMemo(
    () => books.filter((book) => !book.isBooked),
    [books]
  );
  const rentedBooks = useMemo(
    () => books.filter((book) => book.isBooked),
    [books]
  );

  const getAllBooks = useCallback(async () => {
    const accessToken = await getAccessTokenSilently();
    axiosInstance
      .get(routes.books.getAll, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => setBooks(data));
  }, [getAccessTokenSilently]);

  const rentBook = (form) => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      axiosInstance
        .put(routes.rentals.rentBook, form, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => getAllBooks());
    })();
  };

  const handleClick = (book) => {
    console.log(book)
    setBook(book);
    setOpenedModal(true);
  };

  useEffect(() => {
    getAllBooks();
  }, [getAllBooks]);

  return (
    <UserLayout>
      <RentModal
        book={currentBook}
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
        submitForm={rentBook}
      />
      <div className="book-tabs">
        <div
          onClick={() => setTab("rented")}
          className={currentTab === "rented" && "active"}
        >
          Rented books
        </div>
        <div
          onClick={() => setTab("available")}
          className={currentTab === "available" && "active"}
        >
          Available books
        </div>
      </div>
      <div className="books">
        {currentTab === "available" &&
          availableBooks.map((book, index) => (
            <BookCard key={index} {...book} handleClick={handleClick} />
          ))}
        {currentTab === "rented" &&
          rentedBooks.map((book, index) => (
            <BookCard key={index} {...book} rented />
          ))}
      </div>
    </UserLayout>
  );
};

export default UserBooks;
