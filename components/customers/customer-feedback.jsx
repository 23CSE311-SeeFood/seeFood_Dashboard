"use client";

import { Star } from "lucide-react";

export default function CustomerFeedback({ feedback, averageRating, ratingDistribution }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Feedback Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div>
            <div className="flex items-start gap-6">
              <div className="flex flex-col">
                <div className="text-4xl font-bold text-gray-800">{averageRating}</div>
                <div className="text-sm text-gray-500 mt-1">out of 5</div>
              </div>
              <div className="flex flex-col">
                {renderStars(Math.round(averageRating))}
                <div className="text-sm text-gray-500 mt-2">
                  Based on {feedback.length} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating];
                const percentage = (count / feedback.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          rating >= 4
                            ? "bg-green-500"
                            : rating === 3
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h2>
        {feedback.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{item.avatar}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(item.rating)}
                      {item.item && (
                        <span className="text-sm text-gray-500 ml-2">For: {item.item}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.date}</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{item.feedback}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
