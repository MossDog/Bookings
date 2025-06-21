// components/ReviewModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import supabase from "@/utils/supabase";

interface ReviewModalProps {
  bookingId: string;
  sellerId: string;
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

    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      seller_id: sellerId,
      user_id: userId,
      rating,
      comment,
    });

    if (error) {
      setError("Failed to submit review. Please try again.");
      setSubmitting(false);
      return;
    }

    if (onSubmitSuccess) onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-base-content/60 hover:text-error"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-base-content">Leave a Review</h2>

        <div className="form-control mb-4">
          <label className="label">Rating</label>
          <select
            className="select select-bordered"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>{val} Stars</option>
            ))}
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label">Comment</label>
          <textarea
            className="textarea textarea-bordered"
            rows={3}
            placeholder="Write your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-error text-sm mb-2">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;