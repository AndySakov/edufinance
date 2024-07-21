import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { ResponseWithOptionalData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { FinancialAidDiscount } from "@/shared/types/financial-aid/discount";
import { toast } from "@/components/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { BillType } from "@/shared/types/bill-type";
import { FinancialAidCategory } from "@/shared/types/financial-aid/category";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Financial aid discount name must be at least 2 characters",
  }),
  amount: z.string().refine((val) => Number(val) >= 1, {
    message: "Amount must be at least 1",
  }),
  billTypeId: z.string().min(1, {
    message: "Financial aid discount bill type must be at least 1 character",
  }),
  financialAidTypeId: z.string().min(1, {
    message:
      "Financial aid discount financial aid category must be at least 1 character",
  }),
});

export function CreateFinancialAidDiscountForm() {
  const client = useClient();

  const {
    isLoading: isLoadingBillTypes,
    data: billTypes,
    error: billTypesError,
  } = useQuery({
    queryKey: ["bill-types"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<BillType[]>>(
        "/bill-types"
      );
      const results = data.data.map((user, index) => ({
        ...user,
        index: index + 1,
      }));
      return results;
    },
  });

  const {
    isLoading: isLoadingFinancialAidCategories,
    data: financialAidCategories,
    error: financialAidCategoriesError,
  } = useQuery({
    queryKey: ["financial-aid-categories"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<FinancialAidCategory[]>
      >("/financial-aid-types");
      const results = data.data.map((user, index) => ({
        ...user,
        index: index + 1,
      }));
      return results;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    client
      .post<ResponseWithOptionalData<FinancialAidDiscount>>(
        `/financial-aid-discounts`,
        {
          ...values,
          billTypeId: billTypes?.find(
            (billType) => billType.name === values.billTypeId
          )?.id,
          financialAidTypeId: financialAidCategories?.find(
            (financialAidCategory) =>
              financialAidCategory.name === values.financialAidTypeId
          )?.id,
          amount: Number(values.amount) * 100,
        }
      )
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Financial Aid Discount created");
        } else {
          console.log("Error creating financial aid discount");
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Name
                </FormLabel>
                <FormControl {...field}>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Name"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Discount Amount
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="middle-name"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter middle name"
                        /> */}
                  <Input
                    {...field}
                    type="number"
                    id="amount"
                    min={1}
                    placeholder="Discount Amount"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="billTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Bill Type
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
                        id="billTypeId"
                        placeholder="Select bill type"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingBillTypes ? (
                        <SelectItem value="Loading...">
                          <Spinner />
                        </SelectItem>
                      ) : (
                        billTypes?.map((billType) => (
                          <SelectItem key={billType.id} value={billType.name}>
                            {billType.name}
                          </SelectItem>
                        )) ?? (
                          <SelectItem value="No bill types available" disabled>
                            {billTypesError?.message
                              ? "Error loading bill types, please try again later"
                              : "No bill types available"}
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
          <FormField
            control={form.control}
            name="financialAidTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Financial Aid Category
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
                        id="financialAidTypeId"
                        placeholder="Select financial aid category"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingFinancialAidCategories ? (
                        <SelectItem value="Loading...">
                          <Spinner />
                        </SelectItem>
                      ) : (
                        financialAidCategories?.map((financialAidCategory) => (
                          <SelectItem
                            key={financialAidCategory.id}
                            value={financialAidCategory.name}
                          >
                            {financialAidCategory.name}
                          </SelectItem>
                        )) ?? (
                          <SelectItem
                            value="No financial aid categories available"
                            disabled
                          >
                            {financialAidCategoriesError?.message
                              ? "Error loading financial aid categories, please try again later"
                              : "No financial aid categories available"}
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
        <div className="flex space-x-4 mt-4">
          <Button variant="outline">Save</Button>
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
