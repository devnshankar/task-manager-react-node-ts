import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Separator } from "../components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ClipboardCheck, Home, LayoutList, ListTodo, LogOut, Menu, PlusCircle, Trash } from 'lucide-react'
import { Button } from "../components/ui/button"
import DarkModeToggle from '../components/DarkModeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { toast } from "../components/ui/use-toast"
import { Input } from "../components/ui/input"
import { Category, useCategoryStore, useLoginStore } from "../zustand/store"


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at lease 2 charactes",
  }),
})

export default function DashBoard() {
  const { user, setUser, currentCategory, setCurrentCategory, setTaskToEdit, setTaskTitle,
    setTaskDescription,
    setTaskDeadline,
    setTaskPriority,
    setTaskStatus } = useLoginStore();
  const [open, setOpen] = React.useState(false)
  const categoryNames = (user?.categories as Category[])?.map((category) => category.title) || [];
  const navigate = useNavigate();
  const { categories, setCategories } = useCategoryStore();
  const selectedCategory = categories.find(category => category.title === currentCategory);
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null);
    setCategories([])
    setCurrentCategory("")
    setTaskToEdit("")
    setTaskTitle("")
    setTaskDescription("")
    setTaskDeadline("")
    setTaskPriority("")
    setTaskStatus("")
    navigate('/login')
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
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
        `${import.meta.env.VITE_APP_API_URL}/users/categories`,
        values,
        { headers }
      );
      form.reset({
        title: "",
        description: "",
      });
      if (res.data.success) {
        setUser(res.data.user)
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
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }
  };

  const handleCategoryDelete = async () => {
    // @ts-expect-error type errors to be resolved
    const categoryToDelete = user?.categories!.find(category => category.title === currentCategory);
    try {
      if (categoryToDelete) {
        // @ts-expect-error type errors to be resolved
        const categoryIdToDelete = categoryToDelete.id;
        console.log("Category ID to delete:", categoryIdToDelete);
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        // Check if the token exists
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }
        // Set the Authorization header in the Axios request
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/users/categories`,
          {
            headers,
            data: { categoryId: categoryIdToDelete } // Send data in the request body
          }
        );
        if (res.data.success) {
          setUser(res?.data?.user)
          toast({
            title: res.data.message,
          })
        }
        else {
          toast({
            title: "Something went wrong !!!",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "No category selected to delete !!!"
        })
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }
  }

  const deleteTaskHandler = async (id: string) => {
    try {
      if (id) {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage login again');
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/users/tasks`,
          {
            headers,
            data: { id: id }
          }
        );
        if (res.data.success) {
          setCategories(res.data.categories)
          toast({
            title: res.data.message,
          })
        }
        else {
          toast({
            title: "Something went wrong !!!",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "No task selected to delete !!!"
        })
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }
  }

  const startTaskHandler = async (id: string) => {
    try {
      if (id) {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage login again');
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const payload = {
          taskId: id,
          status: "IN_PROGRESS"
        }
        const res = await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/users/tasks`,
          payload,
          { headers }
        );
        if (res.data.success) {
          setCategories(res.data.categories)
          toast({
            title: res.data.message,
          })
        }
        else {
          toast({
            title: "Something went wrong !!!",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "No task selected to update !!!"
        })
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }
  }
  const finishTaskHandler = async (id: string) => {
    try {
      if (id) {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage login again');
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const payload = {
          taskId: id,
          status: "COMPLETED"
        }
        const res = await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/users/tasks`,
          payload,
          { headers }
        );
        if (res.data.success) {
          setCategories(res.data.categories)
          toast({
            title: res.data.message,
          })
        }
        else {
          toast({
            title: "Something went wrong !!!",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "No task selected to update !!!"
        })
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong"
      })
    }
  }


  return (
    <div className="flex border p-4 rounded-lg">
      <div
        className={ ` ${open ? "w-13" : "w-60 "
          } flex flex-col h-screen p-3 border rounded-xl` }
      >
        <div className="space-y-3">
          <div className={ ` ${open ? "justify-center" : "justify-start"
            } flex items-center` }>
            { open ? (<button onClick={ () => setOpen(!open) }>
              <Menu size={ 20 } strokeWidth={ 1.5 } />
            </button>) : (<><button onClick={ () => setOpen(!open) }>
              <Menu size={ 20 } strokeWidth={ 1.5 } className="ml-2" />
            </button>
              <p className="text-md ml pl-2 text-white">Dashboard</p>
            </>) }
          </div>
          <Separator />
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm">
                <Link
                  to="/"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  { open ? (<Home size={ 20 } strokeWidth={ 1.5 } />) : (
                    <>
                      <Home size={ 20 } strokeWidth={ 1.5 } />
                      <span className="text-gray-100">Home</span>
                    </>
                  ) }
                </Link>
                <Separator />
              </li>
              <li className="rounded-sm">
                <div
                  className="flex items-center p-2 space-x-3 rounded-md hover:cursor-pointer"
                >
                  { open ? (
                    <>
                      <LayoutList size={ 20 } strokeWidth={ 1.5 } onClick={ () => { setOpen(false) } } />
                    </>
                  ) : (
                    <>
                      <div>
                        <AlertDialog>
                          <AlertDialogTrigger className="w-full justify-start flex">
                            <LayoutList size={ 30 } strokeWidth={ 1.5 } className="mr-3" />
                            <span
                              className="w-full  flex items-center space-x-3 rounded-md"
                            >
                              Categories
                            </span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Create a new Category !!!</AlertDialogTitle>
                              <AlertDialogDescription>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      Enter the Categoy details
                                    </CardTitle>
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
                                                <Input placeholder="Category title" { ...field } />
                                              </FormControl>
                                              <FormDescription>
                                                This is your category's display title.
                                              </FormDescription>
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
                                                <Input placeholder="Category description" { ...field } />
                                              </FormControl>
                                              <FormDescription>
                                                This is your category's display description.
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          ) }
                                        />
                                        <AlertDialogAction type="submit" className="w-full">
                                          Create
                                        </AlertDialogAction>
                                        <AlertDialogCancel className="p-5 w-full bg-red-500 rounded-lg">Cancel</AlertDialogCancel>
                                      </form>
                                    </Form>
                                  </CardContent>
                                </Card>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  ) }

                </div>
              </li>
              <li className="rounded-sm">
                { open ? (<ul className="w-full">
                  {/* @ts-expect-error type errors to be resolved */}
                  { categoryNames.map((categoryName, index) => (
                    <li className="w-full mb-4 p-2 bg-blue-800 font-semibold text-md  flex items-start space-x-3 rounded-3xl justify-start" key={ index }>
                      <>
                        <ClipboardCheck size={ 20 } strokeWidth={ 1.5 } className="mr-1" />
                      </>
                    </li>)) }
                </ul>) : (
                  <ul className="w-full">
                    { categoryNames.map((categoryName, index) => (
                      <Button onClick={ () => { setCurrentCategory(categoryName) } } className=" w-full text-white-500 h-15 mb-3 p-2  align-middle bg-blue-800 font-semibold text-md  flex items-start space-x-3 rounded-3xl justify-start" key={ index }>
                        <ClipboardCheck size={ 20 } strokeWidth={ 1.5 } className="mr-1" />
                        <span>{ categoryName }</span>
                      </Button>)) }
                  </ul>

                ) }
              </li>
              <li className="rounded-sm">
                <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    <div

                      className="w-full bg-red-500 font-bold flex items-center p-2 space-x-3 rounded-md"
                    >
                      { open ? (<LogOut size={ 20 } strokeWidth={ 1.5 } />
                      ) : (
                        <>
                          <LogOut size={ 20 } strokeWidth={ 1.5 } />
                          <span className="text-black-100">Logout</span>
                        </>
                      ) }
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure to Logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently log you out
                        In order to use the dashboard you must login again !!!
                        Click continue to proceed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 text-white-500 font-semibold" onClick={ handleLogout }>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto ">
        <div className="border p-2 rounded-lg mb-1 w-full h-50">
          <DarkModeToggle />
          <span className="ml-3 ">{ user?.name }</span>
        </div>

        <div className="flex justify-between mx-auto ">
          <span className="bg-blue-800 p-2 m-2 rounded-3xl pr-4 pl-4 flex w-auto">
            <ClipboardCheck size={ 20 } strokeWidth={ 1.5 } className="mr-1" />
            { currentCategory }
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-3xl bg-red-500 mt-3">
                <Trash size={ 20 } strokeWidth={ 1.5 } className="mr-1 justify-end" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure to delete the category?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  category and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={ handleCategoryDelete } className="bg-red-500 text-lg font-semibold">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

        <Tabs defaultValue="todo" className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todo">TO DO</TabsTrigger>
            <TabsTrigger value="inprogress">IN PROGRESS</TabsTrigger>
            <TabsTrigger value="completed">COMPLETED</TabsTrigger>
          </TabsList>
          <TabsContent value="todo">
            <Card>
              <div >
                { (categoryNames.length < 1) ? (<div className="m-10 align-middle flex justify-center text-2xl">Please Create a Category by clicking on Categories button on side bar</div>) : (<Card className="bg-green-900 m-3 mb-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">
                      { (currentCategory) ? (<p>Create New Task under { currentCategory } category</p>) : (<p>In order to create a task</p>) }
                    </CardTitle>
                    <PlusCircle size={ 30 } strokeWidth={ 1.5 } />
                  </CardHeader>
                  <CardContent>

                    { (currentCategory === "") ? (<><p>Please choose one category</p><br/><p>If not any then click on Categories in sidebar to create one</p></>) : (<Link to={ '/task' }>
                      <Button className="bg-green-500 text-white-500 font-semibold text-lg">Create Task</Button> </Link>) }

                  </CardContent>
                </Card>) }

                { (!selectedCategory) ? (
                  <div className="m-10 align-middle flex justify-center text-2xl">No category selected</div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-3">
                    { selectedCategory.tasks
                        // @ts-expect-error type errors to be resolved
                      .filter(task => task.status === "TODO")
                      .map(task => (
                        // @ts-expect-error type errors to be resolved
                        <Card className="bg-blue-950" key={ task.id }>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                             {/* @ts-expect-error type errors to be resolved */}
                            <CardTitle className="text-lg font-bold">{ task.title }</CardTitle>
                            <ListTodo size={ 23 } strokeWidth={ 1.5 } />
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm mb-3">
                              {/* @ts-expect-error type errors to be resolved */}
                              <p>{ task.description }</p>
                              {/* @ts-expect-error type errors to be resolved */}
                              <p>Deadline: { task.deadline.substring(0, 10) }</p>
                              {/* <p>Status: { task.status }</p> */ }
                              {/* @ts-expect-error type errors to be resolved */ }
                              <p>Priority: { task.priority }</p>
                            </div>
                            <div>
                              {/* @ts-expect-error type errors to be resolved */ }
                              <Button onClick={ () => startTaskHandler(task.id) } size="sm" className="text-sm font-semibold mr-3 bg-green-500">
                                Start task
                              </Button>
                              <Link to={ '/edittask' }>
                              {/* @ts-expect-error type errors to be resolved */ }
                                <Button onClick={ () => { setTaskToEdit(task.id); setTaskTitle(task.title); setTaskDescription(task.description); setTaskDeadline(task.deadline); setTaskPriority(task.priority); setTaskStatus(task.status) } } size="sm" className=" text-sm font-semibold bg-purple-500 mr-3">
                                  Edit
                                </Button>
                              </Link>
                              {/* @ts-expect-error type errors to be resolved */}
                              <Button onClick={ () => deleteTaskHandler(task.id) } size="sm" className="text-sm font-semibold bg-red-500 ">
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) }
                  </div>
                ) }

              </div>
            </Card>
          </TabsContent >
          <TabsContent value="inprogress">
            <Card>

              { (!selectedCategory) ? (
                <div className="m-10 align-middle flex justify-center text-2xl">No category selected</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-3">
                  { selectedCategory.tasks
                      // @ts-expect-error type errors to be resolved
                    .filter(task => task.status === "IN_PROGRESS")
                    .map(task => (
                      // @ts-expect-error type errors to be resolved
                      <Card className="bg-blue-950" key={ task.id }>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                          {/* @ts-expect-error type errors to be resolved */}
                          <CardTitle className="text-lg font-bold">{ task.title }</CardTitle>
                          <ListTodo size={ 23 } strokeWidth={ 1.5 } />
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm mb-3">
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>{ task.description }</p>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>Deadline: { task.deadline.substring(0, 10) }</p>
                            {/* <p>Status: { task.status }</p> */ }
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>Priority: { task.priority }</p>
                          </div>
                          <div>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <Button onClick={ () => finishTaskHandler(task.id) } size="sm" className="text-sm font-semibold mr-3 bg-green-500">
                              Finish task
                            </Button>
                            
                            <Link to={ '/edittask' }>
                              {/* @ts-expect-error type errors to be resolved */ }
                              <Button onClick={ () => { setTaskToEdit(task.id); setTaskTitle(task.title); setTaskDescription(task.description); setTaskDeadline(task.deadline); setTaskPriority(task.priority); setTaskStatus(task.status) } } size="sm" className=" text-sm font-semibold bg-purple-500 mr-3">
                                Edit
                              </Button>
                            </Link>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <Button onClick={ () => deleteTaskHandler(task.id) } size="sm" className="text-sm font-semibold bg-red-500">
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )) }
                </div>
              ) }


            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card>

              { (!selectedCategory) ? (
                <div className="m-10 align-middle flex justify-center text-2xl">No category selected</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-3">
                  { selectedCategory.tasks
                      // @ts-expect-error type errors to be resolved
                    .filter(task => task.status === "COMPLETED")
                    .map(task => (
                      // @ts-expect-error type errors to be resolved
                      <Card className="bg-blue-950" key={ task.id }>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                          {/* @ts-expect-error type errors to be resolved */ }
                          <CardTitle className="text-lg font-bold">{ task.title }</CardTitle>
                          <ListTodo size={ 23 } strokeWidth={ 1.5 } />
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm mb-3">
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>{ task.description }</p>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>Deadline: { task.deadline.substring(0, 10) }</p>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <p>Priority: { task.priority }</p>
                          </div>
                          <div>
                            {/* @ts-expect-error type errors to be resolved */ }
                            <Button onClick={ () => deleteTaskHandler(task.id) } size="sm" className="text-sm font-semibold bg-red-500">
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )) }
                </div>
              ) }


            </Card>
          </TabsContent>
        </Tabs >

      </div >
    </div >
  )
}

