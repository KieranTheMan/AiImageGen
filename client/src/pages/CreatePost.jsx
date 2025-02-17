import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader} from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: " ",
    prompt: " ",
    photo: false,
  });
  
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("https://aiimagegen-571e.onrender.com/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });

        const data = await response.json();

        setForm({ ...form, photo: data.photo });
        console.log(form);
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setGeneratingImg();
      }
    } else if(!form.prompt) {
      alert("Please enter prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch("https://aiimagegen-571e.onrender.com/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please  enter a prompt and generate an image");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
    console.log("handleSurpriseMe Clicked");
    console.log(randomPrompt);
  };


  return (
    <div>
      <section className="max-w-7xl mx-auto">
        
        <div>
          <h1 className=" dark:text-white font-extrabold text-[#ffffff] text-[32px]">
            Generate AI Image
          </h1>
          <p className="mt-2 text-gray-50 text-[16px] max-w[500px]">
            Create a imaginative image and share with the Community.
          </p>
        </div>
        <form className="mt-16 max-w-3xl drop-shadow-xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <FormField
              labelName="Your Name"
              type="text"
              name="name"
              value={form.name}
              handleChange={handleChange}
            />
            <FormField
              labelName="Prompt"
              type="text"
              name="prompt"
              placeholder="a pencil and watercolor drawing"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />

            <div
              className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
      focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"
            >
              {form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-9/12 h-9/12 object-contain opacity-40"
                />
              )}

              {generatingImg && (
                <div
                  className="absolute inset-0 z-0 flex
                justify-center items-center bg-[rgb(0,0,0,0.5)] rounded-lg"
                >
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 flex gap-5">
            <button
              type="button"
              onClick={generateImage}
              disabled={!form.name.trim()}
              className={`text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5
                ${!form.name.trim() && !form.prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generatingImg ? "Generating..." : "Generate"}
            </button>
          </div>
          <div className="mt-10">
            <p className="mt-2 text-gray-50 text-[14px]">
              The image you created can now be shared with others in
              the Community.
            </p>
            <button 
              type="submit"
              className="mt-3 text-white bg-[#373DF0]
            font-medium rounded-md text-sm w-full sm:w-auto
            px-5 py-2.5 text-center"
            >
              {loading ? "Sharing..." : "Share with the community"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreatePost;
