import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import axios from 'axios';
import { toast } from '../components/ui/use-toast';
import { Category, useCategoryStore, useLoginStore } from "../zustand/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns"


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 8 characters.",
  }),
  categoryId: z.string().min(2, {
    message: "CategoryId must be at least 2 characters.",
  }),
  deadline: z.date({
    required_error: "A date of deadline is required.",
  }),
  priority: z.string().min(2, {
    message: "Priority must be at least 2 characters.",
  })
})
function CreateTaskForm() {
  const navigate = useNavigate();
  const { user, currentCategory } = useLoginStore();
  const { categories, addCategory } = useCategoryStore();
  const categoryToDelete = (user?.categories as Category[] | undefined)?.find(category => category.title === currentCategory);
  const categoryIdToDelete = categoryToDelete?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: categoryIdToDelete,
      priority: "HIGH",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage login again');
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/tasks`,
        values,
        { headers }
      );
      form.reset({
        title: "",
        description: "",
        categoryId: "",
        priority: "",
      });
      if (res.data.success) {
        addCategory(res.data.category)
        navigate('/dashboard')
        toast({
          title: res.data.message,
        })
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
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }

  }
  console.log(JSON.stringify(categories, null, 2))
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full sm:w-96 md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto">
        <CardHeader >
          <CardTitle>Create task</CardTitle>
          <CardDescription>Enter the task details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form { ...form } >
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
              <FormField
                control={ form.control }
                name="title"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="description"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="@#$%^&*#%" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="deadline"
                render={ ({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={ "outline" }
                            className={ cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            ) }
                          >
                            { field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            ) }
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={ field.value }
                          onSelect={ field.onChange }
                          // disabled={ (date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="priority"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">LOW</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <Button type="submit" className="bg-green-500 text-white-500 font-semibold text-md">Create</Button>
              <Link to={ "/dashboard" } className='ml-4'>
                <Button className="bg-red-500 text-white-500 font-semibold text-md">Cancel</Button>
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTaskForm;
