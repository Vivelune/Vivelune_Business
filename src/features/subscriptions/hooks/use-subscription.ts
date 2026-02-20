import { authClient } from "@/lib/auth-client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useSubscription = () => {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const { data, error } = await authClient.customer.state();
            console.log("Subscription data:", data);
            console.log("Subscription error:", error);
            return data;
        },
        staleTime: 1000 * 30, // 30 seconds - reduce from default
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 5000, // Refetch every 5 seconds
    });
};

export const useHasActiveSubscription = () => {
    const { data: customerState, isLoading, ...rest } = useSubscription();

    console.log("Customer state:", customerState); // Debug log

    const hasActiveSubscription = customerState?.activeSubscriptions &&
        customerState.activeSubscriptions.length > 0;

    // Check for specific products
    const hasVivelunePro = customerState?.activeSubscriptions?.some(
        (sub: any) => sub.product?.slug === "Vivelune-Pro" ||
            sub.productId === "e1a5782b-7524-4aa0-88da-50291670c359"
    );

    const hasPowerhouse = customerState?.activeSubscriptions?.some(
        (sub: any) => sub.product?.slug === "vivelune-powerhouse" ||
            sub.productId === "7e0e35bc-304d-48ff-a3d2-45613fdfb73f"
    );

    return {
        hasActiveSubscription,
        hasVivelunePro,
        hasPowerhouse,
        subscription: customerState?.activeSubscriptions?.[0],
        isLoading,
        ...rest,
    };
};

// Add a refresh function
export const useRefreshSubscription = () => {
    const queryClient = useQueryClient();
    
    return () => {
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
    };
};