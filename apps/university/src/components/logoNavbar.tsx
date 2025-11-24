import { Link } from "react-router-dom";

export const LogoNavbar = () => {
  return (
    <div className="w-full h-28 bg-bgPrimary flex items-center justify-center py-2">
      <Link to={"/"}>
        <img
          src="/logo.png"
          loading="lazy"
          className="w-24 h-24 cursor-pointer"
        />
      </Link>
    </div>
  );
};
