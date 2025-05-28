"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Phone, CreditCard } from "lucide-react";
import { createUser, signInUser } from "@/actions/user.actions";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone_number: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  cardnumber: z
    .string()
    .regex(/^\d+$/, "Card number must contain only digits")
    .min(16, "Card number must be at least 16 digits"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof signUpSchema> | z.infer<typeof signInSchema>;

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      username: "",
      phone_number: "",
      email: "",
      password: "",
      cardnumber: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        const response = isSignUp
          ? await createUser(formData)
          : await signInUser(formData);

        toast.success(response.message);
        if(!isSignUp) window.location.href = '/';
        form.reset();
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
      }
    });
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:justify-normal lg:flex-row bg-black">
      <div className="lg:w-1/2 lg:block hidden w-full h-[50vh] lg:h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')"}}>
      </div>
      <div className="lg:w-1/2 w-full flex items-center justify-center p-4">
        <Card className="w-full bg-white/5 border border-gray-700 max-w-md shadow-lg">
          <CardHeader>
            <h2 className="text-3xl font-bold text-white text-center">
              AirWhite
            </h2>
            <p className="text-center text-sm text-neutral-500">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isSignUp && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-100">Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input
                                placeholder="Enter your username"
                                className="pl-10 outline-none text-white border-white/20"
                                {...field}
                                disabled={isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-100">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input

                                placeholder="Enter your phone number"
                                className="pl-10 text-white outline-none border-white/20"
                                {...field}
                                disabled={isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardnumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-100">Card Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input
                                placeholder="Enter your card number"
                                className="pl-10 text-white outline-none border-white/20"
                                {...field}
                                disabled={isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-100">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            placeholder="Enter your email"
                            className="pl-10 text-white outline-none border-white/20"
                            {...field}
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-100">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 text-white border-white/20 outline-none"
                            {...field}
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-black"
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={toggleAuthMode}
                className="ml-1 text-neutral-100  hover:underline"
                disabled={isPending}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
