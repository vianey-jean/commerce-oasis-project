
import { useToast as useHooksToast } from "@/hooks/use-toast";
import { toast as hooksToast } from "@/hooks/use-toast";

// Re-export toast hooks from the correct location
export const useToast = useHooksToast;
export const toast = hooksToast;
