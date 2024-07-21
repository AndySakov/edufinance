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
import { Spinner } from "../../../spinner";
import { FinancialAidCategory } from "@/shared/types/financial-aid/category";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Financial aid category name must be at least 2 characters",
  }),
});

export interface UpdateFinancialAidCategoryFormProps {
  financialAidCategory?: FinancialAidCategory;
}

export function UpdateFinancialAidCategoryForm({
  financialAidCategory,
}: UpdateFinancialAidCategoryFormProps) {
  const client = useClient();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...financialAidCategory,
    },
    mode: "all",
  });

  if (typeof financialAidCategory === "undefined") {
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
      .patch<ResponseWithOptionalData<FinancialAidCategory>>(
        `/financial-aid-types/${params.id}`,
        {
          ...values,
        }
      )
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Financial aid category updated");
        } else {
          console.log("Error updating financial aid category");
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
            Update this financial aid category's details here.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="gap-4 grid grid-cols-1 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Financial Aid Category Name
                      </FormLabel>
                      <FormControl {...field}>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Financial Aid Category Name"
                        />
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
