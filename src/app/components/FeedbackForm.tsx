"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import API from "../services/api";

// Add this style element
const placeholderStyle = `
  ::placeholder {
    color: #4B5563; /* darker gray (gray-600) */
    opacity: 1;
  }
  :-ms-input-placeholder {
    color: #4B5563;
  }
  ::-ms-input-placeholder {
    color: #4B5563;
  }
`;

interface FeedbackData {
  name: string;
  email: string;
  recipeId?: string;
  rating: number;
  comments: string;
  improvements: string;
  subscribe: boolean;
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    recipeId: "",
    rating: 5,
    comments: "",
    improvements: "",
    subscribe: false,
  });

  const mutation = useMutation({
    mutationFn: (data: FeedbackData) => {
      // Use the API service to submit feedback
      const feedbackForm = {
        name: data.name,
        email: data.email,
        rating: data.rating,
        comments: data.comments,
        improvements: data.improvements,
        subscribe: data.subscribe,
      }
      return API.submitFeedback(feedbackForm);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      recipeId: "",
      rating: 5,
      comments: "",
      improvements: "",
      subscribe: false,
    });
    // Reset the mutation state
    mutation.reset();
  };

  if (mutation.isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold mb-4 text-black">Thank You For Your Feedback!</h2>
          <p className="mb-6 text-gray-600">
            We appreciate your input and will use it to improve our service.
          </p>
          <button
            onClick={resetForm}
            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors shadow-md"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <style>{placeholderStyle}</style>
      {mutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-black">Error submitting feedback. Please try again.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="recipeId" className="block text-gray-700 mb-2 font-medium">
            Recipe ID (if applicable)
          </label>
          <input
            type="text"
            id="recipeId"
            name="recipeId"
            value={formData.recipeId}
            onChange={handleChange}
            placeholder="e.g., 52772"
            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black"
          />
          <p className="text-sm text-gray-500 mt-1">Leave blank if your feedback is about the general application</p>
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-gray-700 mb-2 font-medium">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-gray-600"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="comments" className="block text-gray-700 mb-2 font-medium">
            Comments <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            required
            rows={4}
            placeholder="What did you like about the recipes or application?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black"
          />
        </div>
        
        <div>
          <label htmlFor="improvements" className="block text-gray-700 mb-2 font-medium">
            Suggested Improvements
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formData.improvements}
            onChange={handleChange}
            rows={3}
            placeholder="How can we make this application better?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="h-4 w-4 text-primary border-gray-300 rounded placeholder-gray-600"
          />
          <label htmlFor="subscribe" className="ml-2 block text-gray-700">
            Subscribe to receive updates on new recipes
          </label>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 font-medium shadow-md"
          >
            {mutation.isPending ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
} 