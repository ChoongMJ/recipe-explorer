"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import API from "../services/api";

// Add this style element
const placeholderStyle = `
  ::placeholder {
    color: var(--muted-foreground);
    opacity: 1;
  }
  :-ms-input-placeholder {
    color: var(--muted-foreground);
  }
  ::-ms-input-placeholder {
    color: var(--muted-foreground);
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
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-8 text-surface-foreground shadow-md">
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
          <h2 className="mb-4 text-2xl font-bold">Thank You For Your Feedback!</h2>
          <p className="mb-6 text-muted-foreground">
            We appreciate your input and will use it to improve our service.
          </p>
          <button
            onClick={resetForm}
            className="rounded-md bg-button px-6 py-2 text-button-foreground shadow-md transition-colors hover:bg-button-hover"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 text-surface-foreground shadow-md">
      <style>{placeholderStyle}</style>
      {mutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error submitting feedback. Please try again.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="mb-2 block font-medium text-muted-foreground">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="mb-2 block font-medium text-muted-foreground">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="recipeId" className="mb-2 block font-medium text-muted-foreground">
            Recipe ID (if applicable)
          </label>
          <input
            type="text"
            id="recipeId"
            name="recipeId"
            value={formData.recipeId}
            onChange={handleChange}
            placeholder="e.g., 52772"
            className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-sm text-muted-foreground">Leave blank if your feedback is about the general application</p>
        </div>
        
        <div>
          <label htmlFor="rating" className="mb-2 block font-medium text-muted-foreground">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="comments" className="mb-2 block font-medium text-muted-foreground">
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
            className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div>
          <label htmlFor="improvements" className="mb-2 block font-medium text-muted-foreground">
            Suggested Improvements
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formData.improvements}
            onChange={handleChange}
            rows={3}
            placeholder="How can we make this application better?"
            className="w-full rounded-md border border-input-border bg-input px-3 py-2 text-input-foreground outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-input-border bg-input text-foreground"
          />
          <label htmlFor="subscribe" className="ml-2 block text-muted-foreground">
            Subscribe to receive updates on new recipes
          </label>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-button px-4 py-3 font-medium text-button-foreground shadow-md transition-colors hover:bg-button-hover disabled:opacity-50"
          >
            {mutation.isPending ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
} 
