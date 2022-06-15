import React, { useState, useMemo, useEffect, useCallback } from "react";
import Button from "../../components/Button";
import AdminLayout from "../../utils/AdminLayout";
import { MdEdit, MdDelete } from "react-icons/md";
import BookModal from "../../components/modals/BookModal";
import Table from "../../components/Table";
import Section from "../../components/Section";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../configs/Axios";
import { routes } from "../../configs/Api";
import { useAuth0 } from "@auth0/auth0-react";

const columns = [
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Author",
    accessor: "author",
  },
  {
    Header: "Start date",
    accessor: "startDate",
  },
  {
    Header: "End date",
    accessor: "endDate",
  },
];

const Book = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [openedModal, setOpenedModal] = useState(false);
  const [bookInfo, setData] = useState({});
  const [metricsInfo, setMetricsData] = useState({});

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const id = pathname.split("/").reverse()[0];

  const bookFields = useMemo(
    () => [
      { key: "Title", value: bookInfo.name },
      { key: "Author", value: bookInfo.author },
      { key: "Genre", value: bookInfo.genre },
      { key: "Rental Days", value: bookInfo.maximumDaysForRental + " days" },
      {
        key: "Keywords",
        value:
          bookInfo.keywords &&
          bookInfo.keywords.map((key) => key.name).join(", "),
      },
    ],
    [bookInfo]
  );

  const rentalFields = useMemo(
    () => [
      { key: "Email", value: bookInfo.readerEmail },
      { key: "Phone", value: bookInfo.readerPhone },
      {
        key: "Period",
        value: bookInfo.rendalDate + " - " + bookInfo.expectedRentalEndDate,
      },
      { key: "Days left", value: new Date() - bookInfo.expectedRentalEndDate },
    ],
    [bookInfo]
  );

  const getBook = useCallback(async () => {
    const accessToken = await getAccessTokenSilently();
    axiosInstance
      .get(routes.books.getBook(id), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => setData(data));
  }, [getAccessTokenSilently, id]);

  const getMetricsInfo = useCallback(async () => {
    const accessToken = await getAccessTokenSilently();
    axiosInstance
      .get(routes.metrics.getBook(id), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => setMetricsData(data));
  }, [getAccessTokenSilently, id]);

  const handleDelete = () => {
    alert("Are you sure you want to delete this book?");
    axiosInstance
      .delete(routes.books.deleteBook(id))
      .then(() => navigate("/books"));
  };

  useEffect(() => {
    getBook();
    getMetricsInfo();
  }, [getBook, getMetricsInfo]);

  return (
    <AdminLayout>
      <BookModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>{bookInfo.name}</h2>
        <div className="row-center">
          <Button onClick={() => setOpenedModal(true)}>
            <MdEdit /> Edit
          </Button>
          <Button className="delete-button" onClick={handleDelete}>
            <MdDelete /> Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <Section title={"Book Details"} fields={bookFields} />
        {bookInfo.isBooked && (
          <Section title={"Current Rentals"} fields={rentalFields} />
        )}
        <div className="flex flex-col gap-5">
          <p className="section-title">Book Statistics</p>
          <div className="flex gap-5">
            <div className="statistic-card">
              <div className="card-statistic">
                <p>
                  {metricsInfo.rentalHistory &&
                    metricsInfo.rentalHistory.length}
                </p>
                <p>rentals</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>{metricsInfo.averageRentalTime}</p>
                <p>avg. rental time</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>{metricsInfo.averageRentalCompletion}</p>
                <p>avg. in-time completion</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full p-[1px]">
          <p className="section-title">Rental History</p>
          <Table
            data={metricsInfo.rentalHistory ? metricsInfo.rentalHistory : []}
            columns={columns}
            noHref
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Book;
