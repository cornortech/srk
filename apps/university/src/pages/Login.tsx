import { LoginComponent } from "../components/loginComponent";
import { LogoNavbar } from "../components/logoNavbar";

export const Login = () => {
  return (
    // <div className="relative w-full h-screen  bg-[url('/srklaptop.jpg')] bg-cover bg-no-repeat bg-center ">
    <div className="relative w-full h-screen ">
      <LogoNavbar />
      <div>
        <LoginComponent />
      </div>
      <div className="absolute w-full  h-20 bg-bgPrimary bottom-0"></div>
    </div>
  );
};
