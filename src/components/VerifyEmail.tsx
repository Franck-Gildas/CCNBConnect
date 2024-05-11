import { useEffect } from "react";
import { updateVerification } from "@/lib/appwrite/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "./ui/use-toast";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (userId && secret) {
      // Call your API function to verify the email
      updateVerification(userId, secret)
        .then(() => {
          // Redirect to the home page after successful verification
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          toast({ title: "Login failed. Please try again." });
        });
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>Please wait while we verify your email...</p>
    </div>
  );
}

export default VerifyEmail;
