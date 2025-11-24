import AffiliateProgram from "../../components/affiliate/affiliateLanding/AffliateProgram";

export const AffilatePage = ({ viewMode }: { viewMode: boolean }) => {
  return (
    <div className="bg-bgPrimary">
      <AffiliateProgram viewMode={viewMode} />
    </div>
  );
};
