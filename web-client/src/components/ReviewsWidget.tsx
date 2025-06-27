import { useEffect, useState } from "react";
import { Seller } from "@/types/types";
import ReviewViewModal from "@/components/ReviewViewModal";
import { getPaginatedReviews } from "@/utils/reviews";

interface DisplayReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

interface ReviewsWidgetProps {
  seller: Seller;
}

const REVIEWS_PER_PAGE = 5;

export default function ReviewsWidget({ seller }: ReviewsWidgetProps) {
  const [reviews, setReviews] = useState<DisplayReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReview, setSelectedReview] = useState<DisplayReview | null>(
    null,
  );

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, count } = await getPaginatedReviews(
        seller.user_id,
        page,
        REVIEWS_PER_PAGE,
      );
      setReviews(data);
      setTotalCount(count);
      setLoading(false);
    };

    fetchReviews();
  }, [seller.user_id, page]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md p-6 animate-pulse h-32" />
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="card bg-base-100 p-6">
        <h2 className="card-title mb-4">Customer Reviews</h2>
        <p className="text-base-content/70">No reviews yet.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / REVIEWS_PER_PAGE);

  return (
    <div className="card bg-base-100 p-6">
      <h2 className="card-title mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-base-300 rounded p-4 hover:bg-base-200 cursor-pointer"
            onClick={() => setSelectedReview(review)}
          >
            <div className="flex items-center gap-2 mb-1">
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
              <span className="text-xs text-base-content/50">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="join mt-4 justify-center">
          <button
            className="btn btn-xs join-item"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            «
          </button>
          <span className="btn btn-xs join-item btn-disabled">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-xs join-item"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      )}

      {selectedReview && (
        <ReviewViewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
