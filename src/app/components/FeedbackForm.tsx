"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";

import API from "../services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackData {
  name: string;
  email: string;
  recipeId?: string;
  rating: string;
  comments: string;
  improvements: string;
  subscribe: boolean;
}

const ratingOptions = [
  { value: "5", label: "5 - Excellent" },
  { value: "4", label: "4 - Very Good" },
  { value: "3", label: "3 - Good" },
  { value: "2", label: "2 - Fair" },
  { value: "1", label: "1 - Poor" },
];

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    recipeId: "",
    rating: "5",
    comments: "",
    improvements: "",
    subscribe: false,
  });

  const mutation = useMutation({
    mutationFn: (data: FeedbackData) => {
      const feedbackForm = {
        name: data.name,
        email: data.email,
        rating: Number(data.rating),
        comments: data.comments,
        improvements: data.improvements,
        subscribe: data.subscribe,
      };

      return API.submitFeedback(feedbackForm);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
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
      rating: "5",
      comments: "",
      improvements: "",
      subscribe: false,
    });
    mutation.reset();
  };

  if (mutation.isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="items-center text-center">
          <CheckCircle2Icon className="size-14 text-primary" />
          <CardTitle className="text-2xl">Thank You For Your Feedback!</CardTitle>
          <CardDescription>
            We appreciate your input and will use it to improve our service.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={resetForm} size="lg">
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
        <CardDescription>
          Tell us what you think about the recipe explorer and how we can improve it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mutation.isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Submission failed</AlertTitle>
            <AlertDescription>
              Error submitting feedback. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="recipeId" className="mb-2 block">
              Recipe ID (if applicable)
            </Label>
            <Input
              type="text"
              id="recipeId"
              name="recipeId"
              value={formData.recipeId}
              onChange={handleChange}
              placeholder="e.g., 52772"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Leave blank if your feedback is about the general application.
            </p>
          </div>
          <div>
            <Label htmlFor="rating" className="mb-2 block">
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            
            <Select
              items={ratingOptions}
              value={formData.rating}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, rating: value ?? "5" }))
              }
            >
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comments" className="mb-2 block">
              Comments <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
              rows={4}
              placeholder="What did you like about the recipes or application?"
            />
          </div>

          <div>
            <Label htmlFor="improvements" className="mb-2 block">
              Suggested Improvements
            </Label>
            <Textarea
              id="improvements"
              name="improvements"
              value={formData.improvements}
              onChange={handleChange}
              rows={3}
              placeholder="How can we make this application better?"
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
            <Checkbox
              id="subscribe"
              checked={formData.subscribe}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, subscribe: checked === true }))
              }
            />
            <div className="space-y-1">
              <Label htmlFor="subscribe">
                Subscribe to receive updates on new recipes
              </Label>
              <p className="text-sm text-muted-foreground">
                We&apos;ll only use this to send occasional product updates.
              </p>
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full" size="lg">
            {mutation.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
