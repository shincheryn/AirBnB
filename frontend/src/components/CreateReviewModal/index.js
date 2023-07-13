import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviews';


const CreateReviewModal = ({ closeModal, spotId, onSubmit }) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate form inputs
    if (comment.length < 10 || rating === 0) {
      setError('Please provide a comment and rating.');
      return;
    }

    // Create the review
    const newReview = {
      spotId,
      comment,
      rating,
    };

    try {
      await dispatch(createReview(newReview));
      // Reset form inputs
      setComment('');
      setRating(0);
      setError('');
      // Call the onSubmit callback
      onSubmit(newReview);
    } catch (err) {
      setError('Failed to submit the review. Please try again.');
    }
  };

  return (
    <div className="create-review-modal">
      <h3>How was your stay?</h3>
      {error && <div className="error">{error}</div>}
      <textarea
        placeholder="Leave your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <label>Stars</label>
      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <button disabled={comment.length < 10 || rating === 0} onClick={handleSubmit}>
        Submit Your Review
      </button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default CreateReviewModal;
