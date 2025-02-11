import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const AddJournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionType = location.state?.sessionType === 'post-session' ? 'post' : 'pre';

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4">
        <EmotionLogger 
          initialSessionType={sessionType}
          onSubmitSuccess={() => {
            navigate("/dashboard");
          }}
        />
      </div>
    </AppLayout>
  );
};

export default AddJournalEntry;