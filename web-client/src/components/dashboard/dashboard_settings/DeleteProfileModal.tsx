
import { ShieldAlert, AlertTriangle, X } from "lucide-react";
import { useState } from "react"

interface DeleteProfileModalProps {
  sellerName: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function DeleteProfileModal({
  sellerName,
  onDelete,
  isDeleting = false
}: DeleteProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  
  const isConfirmed = confirmationText === sellerName;
  
  const handleDelete = () => {
    if (isConfirmed && onDelete) {
      onDelete();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false);
      setConfirmationText("");
    }
  };

  return (
    <>
      <button 
        className="btn btn-error gap-2"
        onClick={() => setOpen(true)}
      >
        <ShieldAlert size={18} /> 
        Delete Profile
      </button>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-error/10 rounded-full">
                <AlertTriangle className="text-error" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Delete Profile</h3>
                <p className="text-sm text-base-content/70">This action cannot be undone</p>
              </div>
            </div>

            {/* Warning Content */}
            <div className="space-y-4">
              <div className="alert alert-error">
                <AlertTriangle size={20} />
                <div>
                  <h4 className="font-semibold">Warning!</h4>
                  <p className="text-sm">This will permanently delete your business profile and all associated data.</p>
                </div>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What will be deleted:</h4>
                <ul className="text-sm space-y-1 text-base-content/80">
                  <li>• Your business profile and information</li>
                  <li>• All services and pricing</li>
                  <li>• Customer reviews and ratings</li>
                  <li>• Booking history</li>
                  <li>• Photos and media</li>
                  <li>• Account settings and preferences</li>
                </ul>
              </div>

              {/* Confirmation Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Type <span className="font-bold text-error">"{sellerName}"</span> to confirm:
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder={`Enter "${sellerName}" here`}
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  disabled={isDeleting}
                />
                {confirmationText && !isConfirmed && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Text doesn't match. Please type exactly: {sellerName}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={isDeleting}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className={`btn btn-error gap-2 ${isDeleting ? 'loading' : ''}`}
                onClick={handleDelete}
                disabled={!isConfirmed || isDeleting}
              >
                {!isDeleting && <ShieldAlert size={16} />}
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>

          {/* Modal backdrop */}
          <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
      )}
    </>
  )
}
