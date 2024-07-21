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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { FinancialAidDiscount } from "@/shared/types/financial-aid/discount";
import { toast } from "@/components/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { FinancialAidCategory } from "@/shared/types/financial-aid/category";
import { Spinner } from "@/components/ui/spinner";
import { format, formatISO, isBefore, parse } from "date-fns";
import { CalendarBlank } from "@phosphor-icons/react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";

const formSchema = z
  .object({
    typeId: z.string().min(1, {
      message: "Financial aid category must be at least 1 character",
    }),
    startDate: z
      .string()
      .refine(
        (val) => isBefore(new Date(), parse(val, "dd/MM/yyyy", new Date())),
        {
          message: "Financial aid start date must be in the future",
        }
      ),
    endDate: z
      .string()
      .refine(
        (val) => isBefore(new Date(), parse(val, "dd/MM/yyyy", new Date())),
        {
          message: "Financial aid end date must be in the future",
        }
      ),
  })
  .superRefine((val, ctx) => {
    if (
      isBefore(
        parse(val.endDate, "dd/MM/yyyy", new Date()),
        parse(val.startDate, "dd/MM/yyyy", new Date())
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before end date",
        fatal: true,
        path: ["endDate"],
      });
      return z.NEVER;
    } else {
      return true;
    }
  });

export type ApproveFinancialAidApplicationFormProps = {
  id: number;
};

export function ApproveFinancialAidApplicationForm({
  id,
}: ApproveFinancialAidApplicationFormProps) {
  const client = useClient();

  const {
    isLoading,
    data: financialAidCategories,
    error,
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
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      if (name === "endDate") {
        void form.trigger(["endDate"], {
          shouldFocus: true,
        });
      }
    });

    // Cleanup the subscription on unmount.
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    client
      .patch<ResponseWithOptionalData<FinancialAidDiscount>>(
        `/financial-aid-applications/approve/${id}`,
        {
          ...values,
          typeId: financialAidCategories?.find(
            (financialAidCategory) =>
              financialAidCategory.name === values.typeId
          )?.id,
          startDate: formatISO(
            parse(values.startDate, "dd/MM/yyyy", new Date())
          ),
          endDate: formatISO(parse(values.endDate, "dd/MM/yyyy", new Date())),
        }
      )
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Financial Aid Application approved");
        } else {
          console.log("Error approving financial aid application");
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Start Date
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative mt-1">
                          <Input
                            {...field}
                            value={form?.getValues()?.startDate}
                            onChange={field.onChange}
                            id="startDate"
                            className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter Start Date"
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
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  End Date
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative mt-1">
                          <Input
                            {...field}
                            value={form?.getValues()?.endDate}
                            onChange={field.onChange}
                            id="endDate"
                            className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter End Date"
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
        </div>
        <div className="gap-4 grid grid-cols-1 mt-4">
          <FormField
            control={form.control}
            name="typeId"
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
                      {isLoading ? (
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
                            {error?.message
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
