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
import { ResponseWithOptionalData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { useParams } from "react-router-dom";
import { Spinner } from "../../spinner";
import { BillType } from "@/shared/types/bill-type";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Programme } from "@/shared/types/programme";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Bill type name must be at least 2 characters" }),
  programmeId: z
    .string()
    .min(1, { message: "Programme must be at least 1 character" }),
});

export interface UpdateBillTypeFormProps {
  billType?: BillType;
}

export function UpdateBillTypeForm({ billType }: UpdateBillTypeFormProps) {
  const client = useClient();
  const params = useParams();

  const {
    isLoading,
    data: programmes,
    error,
  } = useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<Programme[]>>(
        "/programmes"
      );
      const results = data.data.map((user, index) => ({
        ...user,
        index: index + 1,
      }));
      return results;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...billType,
      programmeId: billType?.programme ?? "",
    },
    mode: "all",
  });

  if (typeof billType === "undefined") {
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
      .patch<ResponseWithOptionalData<BillType>>(`/bill-types/${params.id}`, {
        ...values,
        programmeId: programmes?.find(
          (programme) => programme.name === values.programmeId
        )?.id,
      })
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Bill type updated");
        } else {
          console.log("Error updating bill type");
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
            Update this bill type's details here.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
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
                  name="programmeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Programme
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
                              id="programmeId"
                              placeholder="Select programme"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoading ? (
                              <SelectItem value="Loading...">
                                <Spinner />
                              </SelectItem>
                            ) : (
                              programmes?.map((programme) => (
                                <SelectItem
                                  key={programme.id}
                                  value={programme.name}
                                >
                                  {programme.name}
                                </SelectItem>
                              )) ?? (
                                <SelectItem
                                  value="No programmes available"
                                  disabled
                                >
                                  {error?.message
                                    ? "Error loading programmes, please try again later"
                                    : "No programmes available"}
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
