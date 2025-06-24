import { useEffect, useState } from "react";
import { Seller } from "@/types/types";
import { getFeaturedFaqs } from "@/utils/getfaqs";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQWidgetProps {
  seller: Seller;
}

export default function FAQWidget({ seller }: FAQWidgetProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      const data = await getFeaturedFaqs(seller.user_id);
      setFaqs(data || []);
    };

    fetchFAQs();
  }, [seller.user_id]);

  if (faqs.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="card-title mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="collapse collapse-arrow border border-base-300 rounded"
          >
            <input
              type="checkbox"
              checked={expanded === faq.id}
              onChange={() =>
                setExpanded(expanded === faq.id ? null : faq.id)
              }
            />
            <div className="collapse-title font-medium flex justify-between items-center">
              {faq.question}
            </div>
            <div className="collapse-content text-base-content/70">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}