import { X } from "lucide-react";
import { DisplayReview } from "@/types/types";

interface ReviewViewModalProps {
  review: DisplayReview;
  onClose: () => void;
}

export default function ReviewViewModal({
  review,
  onClose,
}: ReviewViewModalProps) {
  return (
    <div className="fixed inset-0 bg-base-100/10 backdrop-blur-md z-50 flex justify-center items-center">
      <div className="bg-base-100 rounded-xl w-full max-w-md mx-4 shadow-lg p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center">Review Details</h2>

        <div className="space-y-4">
          {/* Star Rating */}
          <div className="flex justify-center">
            <div className="rating rating-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="radio"
                  name={`rating-${review.id}`}
                  className="mask mask-star-2 bg-orange-400"
                  readOnly
                  checked={i === Math.floor(review.rating)}
                />
              ))}
            </div>
          </div>

          {/* Date */}
          <p className="text-sm text-center text-base-content/50">
            {new Date(review.created_at).toLocaleDateString()}
          </p>

          {/* Comment */}
          <div className="border border-base-300 rounded p-4 text-base-content/70 whitespace-pre-wrap">
            {review.comment}
          </div>
        </div>
      </div>
    </div>
  );
}
