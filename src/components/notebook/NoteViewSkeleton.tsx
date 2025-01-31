export const NoteViewSkeleton = () => {
  return (
    <div className="animate-pulse p-8 space-y-4">
      <div className="h-8 bg-muted/50 rounded w-1/3" />
      <div className="h-4 bg-muted/50 rounded w-1/4" />
      <div className="h-[500px] bg-muted/50 rounded" />
    </div>
  );
};