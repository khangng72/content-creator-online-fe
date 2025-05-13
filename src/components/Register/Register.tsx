'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import Link from 'next/link';
import axios from 'axios';
import { REGISTER } from '@/constants/api';
import { generateApi } from '@/constants/api';
import GenreSelectionPage from '@/components/Gerne/GenreSelectionPage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const FormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' }),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, {
      message: 'Password must include at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must include at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must include at least one number.' })
    .regex(/[@$!%*?&#]/, {
      message: 'Password must include at least one special character.',
    }),
  gender: z.string(),
  nationality: z.string(),
  birthday: z.string(),
});

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showGenrePopup, setShowGenrePopup] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof FormSchema> | null>(
    null
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      gender: '',
      nationality: '',
      birthday: '',
    },
  });

  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate form data
      const validatedData = FormSchema.parse(data);
      setFormData(validatedData);
      setShowGenrePopup(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenreSelectionComplete = async (genres: number[]) => {
    if (!formData) return;

    try {
      const response = await axios.post(generateApi(REGISTER), {
        email: formData.email,
        password: formData.password,
        firstName: formData.first_name,
        lastName: formData.last_name,
        gender: formData.gender,
        nationality: formData.nationality,
        birthday: formData.birthday,
        genreIds: genres || [],
      });

      setSuccessMessage('User registered successfully!');
      console.log('Response:', response.data);

      setTimeout(() => {
        setShowGenrePopup(false);
        router.push('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        setErrorMessage(error.response?.data?.message || 'An error occurred.');
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card rounded-2xl p-5 md:p-10 gap-3 flex flex-col mx-[30px] sm:mx-0"
          >
            <div>
              <h2 className="font-bold text-xl">Create New Account</h2>
            </div>

            <div className="flex gap-3 w-full">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      autoComplete="Current-password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select className="w-full p-2 border rounded" {...field}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  {form.formState.errors.gender && (
                    <p className="text-red-500">
                      {form.formState.errors.gender.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="Nationality" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validating...' : 'Continue'}
            </Button>

            <div className="text-center mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </div>
          </form>
        </Form>
      </section>

      <Dialog open={showGenrePopup} onOpenChange={setShowGenrePopup}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Your Favorite Genres</DialogTitle>
          </DialogHeader>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {successMessage}
            </div>
          )}
          <GenreSelectionPage
            onComplete={handleGenreSelectionComplete}
            onBack={() => setShowGenrePopup(false)}
            initialSelectedGenres={selectedGenres}
            onGenresChange={setSelectedGenres}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
