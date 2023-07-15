import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviews';
import './CreateReviewForm.css';

const CreateReviewModal = ({ closeModal, spotId, onSubmit }) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  // const [images, setImages] = useState('');

  const handleSubmit = async () => {
    // Validate form inputs
    const validationErrors = {};
    if (comment.length < 10) {
      validationErrors.comment = 'Comment must be at least 10 characters long';
    }
    if (rating === 0) {
      validationErrors.rating = 'Please select a rating';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create the review
    const newReview = {
      spotId,
      review: comment,
      stars: rating,

    };

    await dispatch(createReview(newReview));
    // Reset form inputs
    setComment('');
    setRating(0);
    setErrors({});
    // Call the onSubmit callback
    onSubmit(newReview);
  };

  return (
    <div className="create-review-modal">
      <h3>How was your stay?</h3>
      {errors.server && <div className="error">{errors.server}</div>}
      <textarea
        placeholder="Leave your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      {errors.comment && <div className="error">{errors.comment}</div>}
      <label>Stars</label>
      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      {errors.rating && <div className="error">{errors.rating}</div>}
      <button onClick={handleSubmit}>Submit Your Review</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default CreateReviewModal;
