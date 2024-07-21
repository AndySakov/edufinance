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
import { data, ResponseWithOptionalData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { Programme } from "@/shared/types/programme";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Programme name must be at least 2 characters" }),
});

export function CreateProgrammeForm() {
  const client = useClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    client
      .post<ResponseWithOptionalData<Programme>>(`/programmes`, {
        ...values,
      })
      .then((res) => {
        if (res.data.success) {
          const user = data(res.data);
          if (user) {
            window.location.reload();
            console.log("Programme created");
          } else {
            console.log("No data");
          }
        } else {
          console.log("Error creating programme");
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
        <div className="gap-4 grid grid-cols-1 mt-2">
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
        </div>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4"></div>
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
