import { useEffect } from "react";
import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    }
    else {
      navigate("/blogs")
    }
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <Auth type="signin" />
        </div>
        <div className="invisible lg:visible">
          <Quote />
        </div>
      </div>
    </div>
  );
};
