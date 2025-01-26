import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const AddJournalEntry = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Validate entry type
  useEffect(() => {
    const validTypes = ["pre-session", "post-session"];
    if (type && !validTypes.includes(type)) {
      navigate("/dashboard");
    }
  }, [type, navigate]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4">
        <EmotionLogger 
          initialSessionType={type === "pre-session" ? "pre" : "post"}
          onSubmitSuccess={() => {
            navigate("/dashboard");
          }}
        />
      </div>
    </AppLayout>
  );
};

export default AddJournalEntry;