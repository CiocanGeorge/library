import React, { useState, useCallback, useEffect, useMemo } from "react";
import Button from "../../components/Button";
import AccountModal from "../../components/modals/AccountModal";
import UserLayout from "../../utils/UserLayout";
import { MdEdit } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";
import { useAuth0 } from "@auth0/auth0-react";
import axiosInstance from "../../configs/Axios";
import { routes } from "../../configs/Api";
import { daysBetween, prettyDate } from "../../functions";

const Account = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [openedModal, setOpenedModal] = useState(false);
  const [rentalsInfo, setRentalsInfo] = useState([]);
  const [profile, setProfile] = useState({});

  const rentedBooks = useMemo(
    () => rentalsInfo.filter((book) => book.isCurrentlyBooked),
    [rentalsInfo]
  );

  const profileFields = [
    { key: "Name", value: profile.name },
    { key: "Email", value: profile.email },
    { key: "Phone", value: profile.phoneNumber },
    { key: "Address", value: profile.address },
  ];

  const columns = [
    {
      Header: "Title",
      accessor: "bookName",
    },
    {
      Header: "Author",
      accessor: "authorName",
    },
    {
      Header: "Start date",
      accessor: "rentalStartDate",
      Cell: ({ value }) => prettyDate(value),
    },
    {
      Header: "End date",
      accessor: "rentalEndDate",
      Cell: ({ value }) =>
        value ? (
          prettyDate(value)
        ) : (
          <p className="text-purple-secondary font-semibold text-lg">
            Currently reading
          </p>
        ),
    },
    {
      Header: "Total time",
      accessor: "id",
      Cell: (props) =>
        daysBetween(
          props.cell.row.original.rentalStartDate,
          props.cell.row.original.rentalEndDate
        ),
    },
  ];

  const returnBook = (id) => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      axiosInstance
        .put(
          routes.rentals.returnBook(id),
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => getRentalsInfo());
    })();
  };

  const getRentalsInfo = useCallback(async () => {
    const accessToken = await getAccessTokenSilently();
    axiosInstance
      .get(routes.rentals.myRentals, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => setRentalsInfo(data));
  }, [getAccessTokenSilently]);

  const getProfile = useCallback(async () => {
    const accessToken = await getAccessTokenSilently();
    axiosInstance
      .get(routes.profile.getProfile, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => setProfile(data));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    getRentalsInfo();
    getProfile();
  }, [getRentalsInfo, getProfile]);

  return (
    <UserLayout>
      <AccountModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>Jake Markel</h2>
        <Button onClick={() => setOpenedModal(true)}>
          <MdEdit /> Edit
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <Section title={"Profile Details"} fields={profileFields} />
        <div className="flex flex-col gap-5">
          <p className="section-title">Currently Reading</p>
          <div className="flex flex-row gap-4">
            {rentedBooks &&
              rentedBooks.map((book) => (
                <div className="reading-card">
                  <div className="card-statistic">
                    <p className="text-lg font-semibold">{book.bookName}</p>
                    <p className="font-semibold opacity-50">
                      {daysBetween(null, book.expectedRentalEndDate)} remainted
                      until returning date
                    </p>
                  </div>
                  <Button onClick={() => returnBook(book.bookId)}>
                    Return book
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full p-[1px]">
          <p className="section-title">Rental History</p>
          <Table data={rentalsInfo ?? []} columns={columns} noHref />
        </div>
      </div>
    </UserLayout>
  );
};

export default Account;
