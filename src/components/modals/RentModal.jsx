import React from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useForm } from "react-hook-form";

const RentModal = ({ modalIsOpen, closeModal, book, submitForm }) => {
  const { register, handleSubmit, getValues } = useForm();

  const handleClick = async () => {
    const data = getValues();
    submitForm({ bookId: book.id, rentalDays: data.rentalDays });
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add book"
      className="modal"
    >
      <div className="row-between">
        <h2>Rent a book</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
        <Input
          label="Book"
          disabled
          placeholder="Book name"
          value={book.name}
        />
        <Input
          label="Days"
          placeholder="Rental days"
          type="number"
          {...register("rentalDays", {
            max: {
              value: book.maximumDaysForRental,
              message: `Maximum rental days for this book is ${book.maximumDaysForRental}`,
            },
          })}
        />
        <Button type="button" onClick={handleSubmit(handleClick)}>
          Rent book
        </Button>
      </form>
    </Modal>
  );
};

export default RentModal;
