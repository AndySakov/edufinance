import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarBlank } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { format, formatISO, isBefore, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../../spinner";
import { BillType } from "@/shared/types/bill-type";
import { Bill } from "@/shared/types/bill";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Bill name must be at least 2 characters" }),
  amountDue: z.string().refine((val) => Number(val) >= 1, {
    message: "Amount due must be at least 1",
  }),
  dueDate: z
    .string()
    .refine(
      (val) => isBefore(new Date(), parse(val, "dd/MM/yyyy", new Date())),
      {
        message: "Due date must be in the future",
      }
    ),
  installmentSupported: z.enum(["yes", "no"]).default("no"),
  maxInstallments: z.string().refine((val) => Number(val) >= 1, {
    message: "Max installments must be at least 1",
  }),
  billTypeId: z
    .string()
    .min(1, { message: "Bill type must be at least 1 character" }),
});

export function CreateBillForm() {
  const client = useClient();

  const {
    isLoading,
    data: billTypes,
    error,
  } = useQuery({
    queryKey: ["bill-types"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<BillType[]>>(
        "/bill-types"
      );
      const results = data.data.map((bill, index) => ({
        ...bill,
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
      .post<ResponseWithOptionalData<Bill>>(`/bills`, {
        ...values,
        dueDate: formatISO(parse(values.dueDate, "dd/MM/yyyy", new Date())),
        maxInstallments: Number(values.maxInstallments),
        installmentSupported: values.installmentSupported === "yes",
        billTypeId: billTypes?.find(
          (billType) => billType.name === values.billTypeId
        )?.id,
        amountDue: Number(values.amountDue) * 100,
      })
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Bill created");
        } else {
          console.log("Error creating bill");
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Bill Name
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="first-name"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter first name"
                        /> */}
                  <Input {...field} id="name" placeholder="Bill Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amountDue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Amount Due
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
                    id="amountDue"
                    min={1}
                    placeholder="Amount Due"
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
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Due Date
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative mt-1">
                          <Input
                            {...field}
                            value={form?.getValues()?.dueDate}
                            onChange={field.onChange}
                            id="dueDate"
                            className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter Due Date"
                          />
                          <span className="right-0 absolute inset-y-0 flex items-center pr-3">
                            <CalendarBlank className="mr-2 w-4 h-4 -translate-x-1" />
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          {...field}
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(format(date as Date, "dd/MM/yyyy"))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      {isLoading ? (
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
                            {error?.message
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
        </div>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="installmentSupported"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Installment Supported
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="country"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter country"
                        /> */}
                  <Select
                    onValueChange={(val) => {
                      if (val === "yes") {
                        field.onChange(val);
                      } else {
                        form.setValue("maxInstallments", "1");
                        field.onChange(val);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        {...field}
                        id="installmentSupported"
                        placeholder="Select installment supported"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxInstallments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Max Installments
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
                        id="maxInstallments"
                        placeholder="Select max installments"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {form.watch("installmentSupported") === "yes" ? (
                        [...Array(10).keys()].map((num) => (
                          <SelectItem key={num + 1} value={"" + (num + 1)}>
                            {num + 1}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">1</SelectItem>
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
