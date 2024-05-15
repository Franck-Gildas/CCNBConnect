import { Navigate, useOutlet } from "react-router-dom";

const AuthLayout = () => {
  const outlet = useOutlet();

  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <img
            src="/assets/images/auth-img.webp"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            {outlet}
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
