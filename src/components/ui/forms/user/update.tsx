import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Admin } from "@/shared/types/user";
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
import { useParams } from "react-router-dom";
import { Spinner } from "../../spinner";
import { PermissionSelector } from "../../permission-selector";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  permissions: z.array(z.string()).min(1, {
    message: "At least one permission is required",
  }),
});

export interface UpdateUserFormProps {
  user?: Admin;
}

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const client = useClient();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
    },
    mode: "all",
  });

  if (typeof user === "undefined") {
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
      .patch<ResponseWithOptionalData<User>>(`/admins/${params.id}`, {
        ...values,
      })
      .then((res) => {
        if (res.data.success) {
          const user = data(res.data);
          if (user) {
            window.location.reload();
            console.log("User updated");
          } else {
            console.log("No data");
          }
        } else {
          console.log("Error updating user");
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
          <h2 className="font-semibold text-lg">Personal Information</h2>
          <p className="text-muted-foreground text-sm">
            Update this user's personal information here.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        First name
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="first-name"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter first name"
                        /> */}
                        <Input
                          {...field}
                          id="first-name"
                          placeholder="First name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Last name
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="last-name"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter last name"
                        /> */}
                        <Input
                          {...field}
                          id="last-name"
                          placeholder="Last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="gap-4 grid grid-cols-1 mt-4">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="email"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter email"
                        /> */}
                        <PermissionSelector
                          selectedPermissions={field.value}
                          setSelectedPermissions={field.onChange}
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
