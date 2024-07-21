import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClient } from "@/shared/axios";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../../spinner";
import { PaymentCategory } from "@/shared/types/payment-category";
import { DialogClose } from "../../dialog";

const formSchema = z.object({
  desiredInstallments: z.string().refine((val) => Number(val) >= 1, {
    message: "Desired installments must be at least 1",
  }),
  paymentType: z
    .string()
    .min(1, { message: "Payment channel must be at least 1 character" }),
});

export type PayBillFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void | Promise<void>;
  maxInstallments: number;
};

export function PayBillForm(props: PayBillFormProps) {
  const client = useClient();

  const {
    isLoading,
    data: paymentCategories,
    error,
  } = useQuery({
    queryKey: ["payment-categories"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<PaymentCategory[]>
      >("/payment-category");
      const results = data.data.map((paymentCategory, index) => ({
        ...paymentCategory,
        index: index + 1,
      }));
      return results;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  return (
    // <div className="mx-auto p-4 container">
    //   <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
    //     <div>
    //       {/* <h2 className="font-semibold text-lg">Create a new Bill</h2> */}
    //       {/* <p className="text-muted-foreground text-sm">
    //         Enter bill's personal information.
    //       </p> */}

    //     </div>
    //   </div>
    // </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <div className="gap-4 grid grid-cols-1 mt-4">
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Choose a Payment Channel
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="nationality"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter nationality"
                        /> */}
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        {...field}
                        id="paymentType"
                        placeholder="Select payment channel"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="Loading...">
                          <Spinner />
                        </SelectItem>
                      ) : (
                        paymentCategories?.map((paymentCategory) => (
                          <SelectItem
                            key={paymentCategory.id}
                            value={paymentCategory.name}
                          >
                            {paymentCategory.name}
                          </SelectItem>
                        )) ?? (
                          <SelectItem
                            value="No payment channels available"
                            disabled
                          >
                            {error?.message
                              ? "Error loading supported payment channels, please try again later"
                              : "No payment channels available"}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="gap-4 grid grid-cols-1 mt-4">
          <FormField
            control={form.control}
            name="desiredInstallments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  How many installments do you want to make this payment in?
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="state"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter state"
                        /> */}
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        {...field}
                        id="desiredInstallments"
                        placeholder="Select number of installments"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(props.maxInstallments).keys()].map((num) => (
                        <SelectItem key={num + 1} value={"" + (num + 1)}>
                          {num + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <DialogClose>
            <Button variant="outline">Pay</Button>
          </DialogClose>
          <Button
            variant="default"
            disabled={!form.formState.isDirty}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
