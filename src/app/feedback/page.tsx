import { Metadata } from "next";
import FeedbackForm from "../components/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback | Recipe Explorer Lite",
  description: "Share your feedback about our application",
};

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Share Your Feedback</h1>
      <FeedbackForm />
    </div>
  );
} 