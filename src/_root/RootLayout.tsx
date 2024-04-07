import { useOutlet } from "react-router-dom";

const RootLayout = () => {
  const outlet = useOutlet();

  return (
    <div>
      RootLayout
      {outlet}
    </div>
  );
};

export default RootLayout;
