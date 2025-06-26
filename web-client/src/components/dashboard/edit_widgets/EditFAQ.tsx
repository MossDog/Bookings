
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { FAQ } from '@/types/types';
import { fetchFAQs, insertFAQ, updateFAQ, deleteFAQ } from '@/utils/seller';

interface EditFAQProps {
  sellerId: string;
}

interface EditingFAQ {
  id?: string;
  question: string;
  answer: string;
  is_featured: boolean;
}

export default function EditFAQ({ sellerId }: EditFAQProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<EditingFAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, [sellerId]);

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const data = await fetchFAQs(sellerId);
      setFaqs(data);
    } catch (error) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingFAQ({
      question: '',
      answer: '',
      is_featured: false
    });
    setIsCreating(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      is_featured: faq.is_featured
    });
    setIsCreating(false);
  };

  const handleSaveFAQ = async () => {
    if (!editingFAQ || !editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        // Create new FAQ
        const result = await insertFAQ(
          sellerId,
          editingFAQ.question,
          editingFAQ.answer,
          editingFAQ.is_featured
        );

        if (result.success && result.data) {
          setFaqs(prev => [...prev, result.data!]);
          toast.success("FAQ created successfully");
          setEditingFAQ(null);
          setIsCreating(false);
        } else {
          toast.error(result.error || "Failed to create FAQ");
        }
      } else {
        // Update existing FAQ
        const result = await updateFAQ(editingFAQ.id!, {
          question: editingFAQ.question,
          answer: editingFAQ.answer,
          is_featured: editingFAQ.is_featured
        });

        if (result.success && result.data) {
          setFaqs(prev => prev.map(faq => 
            faq.id === editingFAQ.id ? result.data! : faq
          ));
          toast.success("FAQ updated successfully");
          setEditingFAQ(null);
        } else {
          toast.error(result.error || "Failed to update FAQ");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const result = await deleteFAQ(faqId);
      if (result.success) {
        setFaqs(prev => prev.filter(faq => faq.id !== faqId));
        toast.success("FAQ deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete FAQ");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleCancel = () => {
    setEditingFAQ(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
          <p className="text-sm text-base-content/70">
            Manage your FAQ section to help customers find answers quickly.
          </p>
        </div>
        <button 
          className="btn btn-primary gap-2"
          onClick={handleCreateNew}
          disabled={!!editingFAQ}
        >
          <Plus size={18} />
          Add FAQ
        </button>
      </div>

      {/* Create/Edit Form */}
      {editingFAQ && (
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h4 className="card-title text-base">
              {isCreating ? 'Create New FAQ' : 'Edit FAQ'}
            </h4>
            
            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text font-medium">Question</span>
              </label>
              <input
                type="text"
                className="input input-bordered lg:w-xl"
                placeholder="Enter your question..."
                value={editingFAQ.question}
                onChange={(e) => setEditingFAQ(prev => prev ? {...prev, question: e.target.value} : null)}
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text font-medium">Answer</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 resize-none lg:w-xl"
                placeholder="Enter your answer..."
                value={editingFAQ.answer}
                onChange={(e) => setEditingFAQ(prev => prev ? {...prev, answer: e.target.value} : null)}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={editingFAQ.is_featured}
                  onChange={(e) => setEditingFAQ(prev => prev ? {...prev, is_featured: e.target.checked} : null)}
                />
                <div>
                  <span className="label-text font-medium">Featured FAQ</span>
                  <p className="text-xs text-base-content/70">Featured FAQs appear at the top</p>
                </div>
              </label>
            </div>

            <div className="card-actions justify-end gap-2 mt-4">
              <button 
                className="btn btn-ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className={`btn btn-primary gap-2 ${saving ? 'loading' : ''}`}
                onClick={handleSaveFAQ}
                disabled={saving}
              >
                {!saving && <Save size={16} />}
                {saving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/50 mb-2">No FAQs created yet</p>
            <p className="text-sm text-base-content/70">
              Add your first FAQ to help customers find answers quickly
            </p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-base">{faq.question}</h4>
                      {faq.is_featured && (
                        <div className="badge badge-primary gap-1">
                          <Star size={12} />
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="text-base-content/80 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEditFAQ(faq)}
                      disabled={!!editingFAQ}
                      title="Edit FAQ"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      disabled={!!editingFAQ}
                      title="Delete FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
