import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlistService";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export const WISHLIST_QUERY_KEY = ["wishlist"];
export const WISHLIST_IDS_QUERY_KEY = ["wishlist", "ids"];

export const useToggleWishlist = () => {
  const toggleStore = useWishlistStore((state) => state.toggle);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!isLoggedIn) {
        router.push("/login");
        throw new Error("UNAUTHORIZED");
      }
      return wishlistService.toggleWishlist(productId);
    },
    onMutate: async (productId) => {
      if (!isLoggedIn) return;
      // Optimistic update
      const isCurrentlyAdded = isInWishlist(productId);
      toggleStore(productId, !isCurrentlyAdded);
      return { isCurrentlyAdded };
    },
    onError: (err, productId, context) => {
      // Revert if error
      if (context && context.isCurrentlyAdded !== undefined) {
        toggleStore(productId, context.isCurrentlyAdded);
      }
    },
  });
};
