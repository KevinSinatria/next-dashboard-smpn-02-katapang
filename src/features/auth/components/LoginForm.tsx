import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username wajib diisi.",
  }),
  password: z.string().min(1, {
    message: "Password wajib diisi.",
  }),
});

type LoginFormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isOpenPassword, setIsOpenPassword] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const { setIsLoading, isLoading } = useAuth();

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoadingForm(true);
    setIsLoading((prev: boolean) => !prev);

    try {
      const response = await apiClient.post("/auth/login", data);

      if (response.data.success) {
        const { user } = response.data;
        // localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Berhasil masuk dengan username ${user.username}`);
        setIsLoading((prev: boolean) => !prev);
        if (!isLoading) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col gap-4 text-black justify-center"
      >
        <h1 className="text-2xl font-bold text-center md:text-left">Masuk</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan username..." {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="w-full relative flex items-center">
                  <Input
                    type={isOpenPassword ? "text" : "password"}
                    placeholder="Masukkan password..."
                    {...field}
                  />
                  <div
                    onClick={() => {
                      if (isOpenPassword) {
                        setIsOpenPassword(false);
                      } else {
                        setIsOpenPassword(true);
                      }
                    }}
                    className="absolute right-2"
                  >
                    {isOpenPassword ? (
                      <EyeClosed className="cursor-pointer" />
                    ) : (
                      <Eye className="cursor-pointer" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-4 flex gap-2"
          type="submit"
          disabled={isLoadingForm}
        >
          {isLoadingForm && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoadingForm ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
}
