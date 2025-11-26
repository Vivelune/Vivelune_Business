import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {    
    await requireAuth();
    return <div>Main</div>;   
};
  
export default Page;