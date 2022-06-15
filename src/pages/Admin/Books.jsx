import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import AdminLayout from "../../utils/AdminLayout";
import { MdAdd } from "react-icons/md";
import BookModal from "../../components/modals/BookModal";
import { useAuth0 } from "@auth0/auth0-react";
import { routes } from "../../configs/Api";
import axiosInstance from "../../configs/Axios";

const columns = [
  {
    Header: "Title",
    accessor: "name",
  },
  {
    Header: "Author",
    accessor: "author",
  },
  {
    Header: "Genre",
    accessor: "genre",
  },
  {
    Header: "Rental Days Allowed",
    accessor: "maximumDaysForRental",
  },
  {
    Header: "Booked",
    accessor: "isBooked",
    Cell: ({ value }) => (value ? "Yes" : "No"),
  },
];

const Books = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [books, setBooks] = useState([]);
  const [openedModal, setOpenedModal] = useState(false);

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

  const handleAddBook = (form) => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      axiosInstance
        .post(routes.books.addBook, form, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => getAllBooks());
    })();
  };

  useEffect(() => {
    getAllBooks();
  }, [getAllBooks]);

  return (
    <AdminLayout>
      <BookModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
        submitForm={handleAddBook}
      />
      <div className="row-between">
        <h2>
          {books.length} {books.length > 1 ? `Books` : "Book"}
        </h2>
        <Button onClick={() => setOpenedModal(true)}>
          <MdAdd /> Add Book
        </Button>
      </div>
      <Table data={books} columns={columns} />
    </AdminLayout>
  );
};

export default Books;
