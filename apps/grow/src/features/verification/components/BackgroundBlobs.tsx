export const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
    </div>
  );
};
