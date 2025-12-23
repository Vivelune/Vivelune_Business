"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {useForm} from "react-hook-form"
import {email, z} from "zod"
import { toast } from "sonner"
import {Button} from "@/components/ui/button"
import { Card,CardContent,CardDescription, CardHeader,CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import {authClient} from '@/lib/auth-client'
import { Loader2Icon } from "lucide-react"

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    const signInGithub = async ()=>{


    await authClient.signIn.social({
        provider: "github"
    },
{
     onSuccess: () => {
            
            router.push("/workflows")

        },
        
        onError: () => {
            
      // Handle the error
     

            toast.error("Something went wrong")
        }
})

    }
const signInGoogle = async ()=>{


    await authClient.signIn.social({
        provider: "google"
    },
{
     onSuccess: () => {
            
            router.push("/workflows")
        },
        onError: () => {
            toast.error("Something went wrong")
        }
})

    }



    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/workflows",
            
        },
    {
        onSuccess: () => {
            
            router.push("/workflows")
            toast.success("Logged in successfully")
        },
        onError: (ctx) => {
             if (ctx.error.status === 403) {
        toast.error("Please verify your email address");
      }
      //you can also show the original error message
      toast.error(ctx.error.message);
            toast.error(ctx.error.message)
        }
    })
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Login to your account to continue
                    </CardDescription>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className="flex flex-col gap-4">
                                        <Button 
                                        onClick={signInGithub}
                                        variant="outline" className="w-full" type="button" disabled={isPending}>
                                            <Image width={20} height={20} alt="Github Logo" src="/github.svg"/>
                                            Contiue with Github
                                        </Button>
                                        <Button 
                                        onClick={signInGoogle}
                                        variant="outline" className="w-full" type="button" disabled={isPending}>
                                            <Image width={20} height={20} alt="Google Logo" src="/google.svg"/>
                                            Contiue with Google
                                        </Button>
                                    </div>
                                    <div className="grid gap-6">
                                        <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="m@example.com" type="email"  {...field}/>
                                                    
                                                </FormControl>
                                            </FormItem>
                                        )}/>
                                        <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="*******" type="password"  {...field}/>
                                                    
                                                </FormControl>
                                            </FormItem>
                                        )}/>

                                        <Button type="submit" className="w-full" disabled={isPending}>
                                          {isPending ? (<div>
                                                <Loader2Icon className="animate-spin"/>
                                            </div>) : "Login"}
                                        </Button>

                                    </div>

                                    <div className="text-center text-sm">
                                        Don't have an account?{' '}
                                        <Link href="/signup" className="underline underline-offset-4 ">
                                            Sign up
                                        </Link>
                                    </div>

                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}