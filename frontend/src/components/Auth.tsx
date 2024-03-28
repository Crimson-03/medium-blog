import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@crimson03/medium-blog";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const data = response.data;
      localStorage.setItem("token",data.jwt);
      navigate("/blogs")
      console.log(response);
    } catch (error) {
      alert("error while signing up");
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an Account</div>
            <div className="text-slate-400">
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Login" : "SignUp"}
              </Link>
            </div>
          </div>
          <div className="pt-4">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Krishan Kumar..."
                onChange={(e) => {
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }));
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="yourname@mail.com"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }));
              }}
            />
            <LabelledInput
              label="Password"
              placeholder="12345"
              type={"password"}
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  password: e.target.value,
                }));
              }}
            />
            <button
              type="button"
              onClick={sendRequest}
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 text-black font-semibold pt-2"
      >
        {label}
      </label>
      <input
        type={type || "text"}
        onChange={onChange}
        id={label}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
