"use client"

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,

}
from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";



const menuItems = [
    {
        title: "Main",
        items:[
            {
                title: "Workflows",
                icons: FolderOpenIcon,
                url:"/workflows",
                
            },
            {
                title: "Credentials",
                icons: KeyIcon,
                url:"/credentials",
                
            },
             {
                title: "Executions",
                icons: HistoryIcon,
                url:"/executions",
                
            },
            
        ]
    }
]

export const AppSidebar = () => {

    const router = useRouter();
    const pathname = usePathname();
    const {signOut} = useClerk();
    const {user } = useUser();
    const {hasActiveSubscription, isLoading}= useHasActiveSubscription()



    const handleSignOut = () =>{
        signOut(()=> router.push('/'))
    }
   

    const handleCheckout = async () => {
        try {
          console.log('🚀 Starting Stripe checkout with price ID:', process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);
          
          const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
            }),
          });
      
          console.log('📥 Response status:', response.status);
          const data = await response.json();
          console.log('📥 Response data:', data);
      
          if (!response.ok) {
            console.error('❌ Checkout failed:', data);
            toast.error(data.error || data.details || 'Failed to create checkout');
            return;
          }
      
          if (data.url) {
            console.log('✅ Redirecting to Stripe checkout URL:', data.url);
            window.location.href = data.url;
          }
        } catch (error) {
          console.error('❌ Checkout error:', error);
          toast.error('Failed to start checkout process');
        }
      };
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-20 px-4">
                        <Link prefetch href="/">
                        <Image src="/logo-primary.png" alt="Vivleune Business Logo" width={50} height={50} className=''/>
                        <span className="text-xl uppercase font-bold"> Vivelune</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                             <SidebarMenu>
                            {group.items.map((item) => (
                           
                            <SidebarMenuItem
                                key={item.title}>
                                    <SidebarMenuButton tooltip={item.title}
                                    isActive={
                                            item.url === "/"
                                            ? pathname ==="/"
                                            : pathname.startsWith(item.url)
                                        }
                                        
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                        
                                        >
                                        <Link href={item.url} prefetch>
                                            <item.icons className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    


                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                
                        ))}
                        </SidebarMenu>
                            
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))} 
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {!hasActiveSubscription && !isLoading && (
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upgrade to Pro"
                         className="gap-x-4"
                         onClick={handleCheckout}>
                            <StarIcon className="h-4 w-4"/>
                            <span>Get Vivelune Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
               
                
                

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Billing Portal" className="gap-x-4" onClick={()=>{window.location.href="/api/billing-portal"}}>
                            <CreditCardIcon className="h-4 w-4"/>
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Sign Out" className="gap-x-4" onClick={handleSignOut}>
                            <LogOutIcon className="h-4 w-4"/>
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}