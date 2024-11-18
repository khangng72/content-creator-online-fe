// import { Eye } from 'lucide-react'
import React from 'react'

const Register = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
        <main>
            <section className="min-h-screen flex flex-col items-center justify-center ">

                <div className="bg-bookCard block rounded-2xl shadow-lg max-w-3xl p-5 items-center ">
                    <div className='flex justify-center items-center mb-3'>
                        <h2 className="font-bold text-2xl text-foreground">Create an account</h2>
                    </div>
                    <div className="p-2 flex flex-col gap-4">
                        <div className='flex gap-2 '>
                            <input className="p-2 rounded-xl" type='text' placeholder='Enter your first name' />
                            <input className="p-2 rounded-xl" type='text' placeholder='Enter your last name' />
                        </div>

                        <div className='flex'>
                            <input className="w-full p-2 rounded-xl" type='text' placeholder='Enter your email' />
                        </div>

                        <div className='flex gap-2'>
                            <input className="p-2 rounded-xl" type='password' placeholder='Enter your password' />
                            <input className="p-2 rounded-xl" type='password' placeholder='Confirm your password' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='text-foreground'>Select your birthday</label>
                            <div className='flex items-center justify-start gap-5  w-full'>
                                <select>
                                    <option>Day</option>
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>

                                <select>
                                    <option>Month</option>
                                </select>

                                <select>
                                    <option>Year</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Register
