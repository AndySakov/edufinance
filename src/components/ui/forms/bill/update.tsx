import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarBlank } from "@phosphor-icons/react";
import { Bill } from "@/shared/types/bill";
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
import { ResponseWithOptionalData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { useParams } from "react-router-dom";
import { Spinner } from "../../spinner";
import { format, formatISO, isBefore, parse } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { BillType } from "@/shared/types/bill-type";
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

export interface UpdateBillFormProps {
  bill?: Bill;
}

export function UpdateBillForm({ bill }: UpdateBillFormProps) {
  const client = useClient();
  const params = useParams();

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
    defaultValues: {
      ...bill,
      amountDue: bill?.amountDue.toString(),
      dueDate: bill?.dueDate ? format(bill?.dueDate, "dd/MM/yyyy") : "",
      maxInstallments: bill?.maxInstallments.toString(),
      installmentSupported: bill?.installmentSupported ? "yes" : "no",
      billTypeId: bill?.billType ?? "",
    },
    mode: "all",
  });

  if (typeof bill === "undefined") {
    return (
      <div className="mx-auto p-4 container">
        <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
          <div>
            <h2 className="font-semibold text-lg">Loading...</h2>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    client
      .patch<ResponseWithOptionalData<Bill>>(`/bills/${params.id}`, {
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
          console.log("Bill updated");
        } else {
          console.log("Error updating bill");
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
    <div className="mx-auto p-4 container">
      <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
        <div>
          <h2 className="font-semibold text-lg">Details</h2>
          <p className="text-muted-foreground text-sm">
            Update this bill's details here.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
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
                          id="amountDue"
                          type="number"
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
                            <PopoverContent
                              className="p-0 w-auto"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                {...field}
                                selected={new Date(field.value)}
                                onSelect={(date) =>
                                  field.onChange(
                                    format(date as Date, "dd/MM/yyyy")
                                  )
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
                                <SelectItem
                                  key={billType.id}
                                  value={billType.name}
                                >
                                  {billType.name}
                                </SelectItem>
                              )) ?? (
                                <SelectItem
                                  value="No bill types available"
                                  disabled
                                >
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
                                <SelectItem
                                  key={num + 1}
                                  value={"" + (num + 1)}
                                >
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
                <Button
                  variant="outline"
                  disabled={
                    !form.formState.isDirty || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting ? <Spinner /> : "Save Changes"}
                </Button>
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
        </div>
      </div>
    </div>
  );
}
