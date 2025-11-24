export const DescriptionBanner = (props: { pageDescription: string }) => {
  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-r from-black to-green-600">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-red-50-600/90" />
      <div className="relative z-10 flex h-full items-center px-8">
        <h1 className="text-4xl font-bold text-white">
          {props.pageDescription}
        </h1>
      </div>
    </div>
  );
};
