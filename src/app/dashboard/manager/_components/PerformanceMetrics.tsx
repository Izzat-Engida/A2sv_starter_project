export default function PerformanceMetrics() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="space-y-2">
        <strong className="text-gray-800">Treat Performance</strong>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Java R: 2.5x0xgms / Avg. 2.5 xgm
          </span>
          <span className="text-gray-600">12 Revisions: 8 Revisions</span>
        </div>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">M&A-R: 2.5x0xgms / Avg. 2.5 xgm</span>
        <span className="text-gray-600">8 Revisions</span>
      </div>

      <div className="space-y-2">
        <strong className="text-gray-800">Review</strong>
        <div>
          <span className="text-gray-600">Value Details</span>
        </div>
      </div>
    </div>
  );
}
