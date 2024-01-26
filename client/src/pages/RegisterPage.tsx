import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email( {
    message: "Email must be a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

function RegisterPage() {
  const { toast } = useToast()
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/signup`, values
      )
      if(res.data.success){
        navigate('/login')
        toast({
          title: res.data.message,
          description: "Please login with the latest credentials",
        })
      }
      else{
        toast({
          variant: "destructive",
          title: res.data.message,
          description: "Please register again with new credentials",
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
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your details and register</CardDescription>
        </CardHeader>
        <CardContent>
          <Form { ...form } >
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
              <FormField
                control={ form.control }
                name="name"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" { ...field } />
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
                name="email"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" { ...field } />
                    </FormControl>
                    <FormDescription>
                      This is your email.
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
                      This is your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link to={ "/login" }>Already a user? Login here !!!</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;
