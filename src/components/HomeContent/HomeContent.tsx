import { useEffect } from "react";
import style from "./homeContent.module.css";
import { useNavigate } from "react-router-dom";
import { wakeBackend } from "../../axios";
import Cookies from "js-cookie";

const HomeContent = () => {
  const navigate = useNavigate();
  let loggedUserData = null;

  const WakeBackendAPI = async () => {
    try {
      await wakeBackend();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    WakeBackendAPI();

    loggedUserData = Cookies.get("tokenData");

    if (loggedUserData) {
      navigate("/lists");
      return;
    }
  }, [navigate]);

  if (loggedUserData) {
    // Prevent rendering the rest of the page if redirecting

    return null;
  }

  return (
    <div className="container">
      <main className={style.mainContainer}>
        <div className={style.messageDiv}>
          <h2 className={style.message}>
            Always forgetting what you need when you go grocery shopping?
          </h2>
          <h2 className={style.message}>
            Create a grocery list based on what you have at home, or start a
            custom list just for you.
          </h2>
        </div>
      </main>
    </div>
  );
};

export default HomeContent;
