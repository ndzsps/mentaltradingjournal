import { toast } from "sonner";

export const useJournalToast = () => {
  const showSuccessToast = (sessionType: "pre" | "post") => {
    toast.success(
      `${sessionType === "pre" ? "Pre" : "Post"}-Session Review Completed! 🎉`,
      {
        description: "Great job maintaining your trading discipline!",
        duration: 5000, // 5 seconds
      }
    );
  };

  return { showSuccessToast };
};