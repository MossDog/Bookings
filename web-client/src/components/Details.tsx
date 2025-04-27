import { FaStar, FaCommentDots, FaMoneyBillWave, FaUtensils } from 'react-icons/fa';

type DetailsProps = {
    rating: number;
    reviews: number;
    priceRange: string;
    category: string;
  };
  
  export default function Details({ rating, reviews, priceRange, category }: DetailsProps) {
    return (
        <div className="details">
        <div className="detail-item"><FaStar /> {rating}</div>
        <div className="detail-item"><FaCommentDots /> {reviews} Reviews</div>
        <div className="detail-item"><FaMoneyBillWave /> {priceRange}</div>
        <div className="detail-item"><FaUtensils /> {category}</div>
      </div>
    );
  }

  