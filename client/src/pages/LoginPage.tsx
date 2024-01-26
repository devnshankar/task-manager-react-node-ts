import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email({
    message: "The email must be a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import axios from 'axios';
import { toast } from '../components/ui/use-toast';
import { useCategoryStore, useLoginStore } from "../zustand/store"

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useLoginStore();
  const { setCategories } = useCategoryStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/login`, values
      )
      if (res.data.success) {
        navigate('/dashboard')
        localStorage.setItem("token", res.data.token);
        toast({
          title: res.data.message,

        })
        setUser(res.data.user)
        setCategories(res.data.categories)
        console.log(JSON.stringify(res.data.categories, null, 2))
      }
      else {
        toast({
          variant: "destructive",
          title: res.data.message,
          description: "Please provide correct credentials",
        })
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full sm:w-96 md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto">
        <CardHeader >
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your details and login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form { ...form } >
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
              <FormField
                control={ form.control }
                name="email"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" { ...field } />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="password"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="@#$%^&*#%" { ...field } />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link to={ "/register" }>Not a user? Register here !!!</Link>
        </CardFooter>
      </Card>



    </div>
  );
}

export default LoginForm;
