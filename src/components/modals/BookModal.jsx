import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import Keywords from "../Keywords";
import { useForm } from "react-hook-form";

const BookModal = ({ modalIsOpen, closeModal, submitForm }) => {
  const { register, handleSubmit, getValues } = useForm();
  const [keywords, setKeywords] = useState([]);

  const handleClick = async () => {
    const data = getValues();
    submitForm({ ...data, keywords });
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add book"
      className="modal"
      ariaHideApp={false}
    >
      <div className="row-between">
        <h2>Add book</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
        <Input label="Name" placeholder="Book name" {...register("name")} />
        <Input
          label="Author"
          placeholder="Author of the book"
          {...register("author")}
        />
        <Keywords
          keywords={keywords}
          setKeywords={setKeywords}
          label="Keywords"
          placeholder="Press enter to save keyword"
        />
        <div className="gap-2 row-between">
          <Input
            label="Genre"
            placeholder="Book genre"
            {...register("genre")}
          />
          <Input
            label="Rental Days"
            placeholder="Rental days"
            type="number"
            {...register("maximumDaysForRental")}
          />
        </div>
        <Button type="button" onClick={handleSubmit(handleClick)}>
          Add book
        </Button>
      </form>
    </Modal>
  );
};

export default BookModal;
