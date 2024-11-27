import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import {FormField, Formfield, Loader} from '../components'


const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: " ",
    prompt: " ",
    photo: " ",
});
const [generateingImg, setGeneratingImg] = useState(false);
const [loading, setLoading] = useState(false);


  return (
    <section className='max-w-7 mx-auto'>
      <div>
      <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Creeate a imaginative image and share with the Community.
        </p>
        </div>
        <form className='mt-16 max-w-3x1' onSubmit={handleSubmit}>
          <FormField
            labelName='your name'
            type ='text'
            name= 'name'
            placeholder='james'
            value={form.name}
            handleChange={handelChange}
          />
           <FormField
            labelName='Prompt'
            type ='text'
            name= 'name'
            placeholder='a pencil and watercolor drawing of a bright city in the future with flying cars'
            value={form.prompt}
            handleChange={handelChange}
            isSurpriseMe
            handleSurprise={handleSurpriseMe}
          />

        </form>
    </section>
  )
}

export default CreatePost