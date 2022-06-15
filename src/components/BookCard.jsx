import React from "react";
import { BsDot } from "react-icons/bs";
import Button from "./Button";

const BookCard = ({
  id,
  name,
  author,
  maximumDaysForRental,
  genre,
  keywords,
  rented,
  handleClick,
}) => {
  return (
    <div className={`book-card ${rented && "rented"}`}>
      <div className="book-group">
        <div className="card-heading">
          <p>{author}</p> <BsDot /> <p>{genre}</p>
        </div>
        <div className="title">
          <h3>{name}</h3>
        </div>
      </div>
      <div className="keywords">
        {keywords.length > 0 &&
          keywords.map((keyword) => keyword.name).join(", ")}
      </div>
      {!rented && (
        <Button onClick={() => handleClick({ id, name, maximumDaysForRental })}>
          Rent
        </Button>
      )}
      {rented && <Button disabled>Currently rented</Button>}
    </div>
  );
};

export default BookCard;
