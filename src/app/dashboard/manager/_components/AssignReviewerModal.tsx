import { useState } from "react";
import { Application } from "../page";

interface AssignReviewerModalProps {
  application: Application;
  onClose: () => void;
  onSubmit: (reviewerId: string) => void;
}

// Mock reviewers - in a real app, you would fetch these from your API
const MOCK_REVIEWERS = [
  { id: "223277f0-af11-44c5-843e-23afcb194ea8", name: "John Doe" },
  { id: "323277f0-af11-44c5-843e-23afcb194ea9", name: "Jane Smith" },
  { id: "423277f0-af11-44c5-843e-23afcb194ea0", name: "Robert Johnson" },
];

export default function AssignReviewerModal({
  application,
  onClose,
  onSubmit,
}: AssignReviewerModalProps) {
  const [reviewerId, setReviewerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerId) {
      setError("Please select a reviewer");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(reviewerId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              Assign Reviewer
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Assigning reviewer for application by{" "}
              <span className="font-medium">{application.applicant_name}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="reviewer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Reviewer
                </label>
                <select
                  id="reviewer"
                  value={reviewerId}
                  onChange={(e) => {
                    setReviewerId(e.target.value);
                    setError("");
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a reviewer</option>
                  {MOCK_REVIEWERS.map((reviewer) => (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.name}
                    </option>
                  ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Assigning..." : "Assign Reviewer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
