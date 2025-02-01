export const NotesLoadingSkeleton = () => {
  return (
    <div className="p-4">
      <div className="animate-pulse space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-lg" />
        ))}
      </div>
    </div>
  );
};