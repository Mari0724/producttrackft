import { toast as shadToast } from "sonner";

export const useToast = () => {
  return {
    toast: shadToast
  }
};