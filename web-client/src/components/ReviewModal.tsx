import React, { useState } from "react";
import { X } from "lucide-react";
import { submitReview } from "@/utils/reviews";

interface ReviewModalProps {
  bookingId: string;
  sellerId: number;
  userId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  bookingId,
  sellerId,
  userId,
  onClose,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const result = await submitReview({
      bookingId,
      sellerId,
      userId,
      rating,
      comment,
    });

    if (!result.success) {
      setError("Failed to submit review. Please try again.");
      setSubmitting(false);
      return;
    }

    if (onSubmitSuccess) onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-base-100/10 backdrop-blur-md z-50 flex justify-center items-center">
      <div className="bg-base-100 rounded-xl w-full max-w-lg mx-4 shadow-lg p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center">Leave a Review</h2>

        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val !== 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Comment</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;