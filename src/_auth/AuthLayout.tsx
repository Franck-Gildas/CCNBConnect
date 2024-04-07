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
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            {outlet}
          </section>

          <img
            src="/src/assets/images/auth-img.webp"
            alt="authentification image"
            className="hidden h-screen w-1/2 object-fill xl:block bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
