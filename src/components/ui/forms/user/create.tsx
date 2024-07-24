import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/shared/types/user";
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
import { AdminPermissions } from "@/shared/constants";
import { PermissionSelector } from "../../permission-selector";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .min(2, { message: "Email must be at least 2 characters" }),
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

export function CreateUserForm() {
  const client = useClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      permissions: [AdminPermissions.DASHBOARD_ACCESS],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    client
      .post<ResponseWithOptionalData<User>>(`/admins`, {
        ...values,
      })
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("User created");
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
    // <div className="mx-auto p-4 container">
    //   <div className="space-y-6 bg-white shadow-sm mx-auto p-6 rounded-lg max-w-3xl">
    //     <div>
    //       {/* <h2 className="font-semibold text-lg">Create a new User</h2> */}
    //       {/* <p className="text-muted-foreground text-sm">
    //         Enter student's personal information.
    //       </p> */}

    //     </div>
    //   </div>
    // </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="gap-4 grid grid-cols-1 mt-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Email
                </FormLabel>
                <FormControl {...field}>
                  {/* <input
                          {...field}
                          type="text"
                          id="email"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm focus:ring-indigo-500 w-full sm:text-sm"
                          placeholder="Enter email"
                        /> */}
                  <Input
                    {...field}
                    id="email"
                    placeholder="Email"
                    className="w-full"
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
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm focus:ring-indigo-500 w-full sm:text-sm"
                          placeholder="Enter first name"
                        /> */}
                  <Input {...field} id="first-name" placeholder="First name" />
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
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm focus:ring-indigo-500 w-full sm:text-sm"
                          placeholder="Enter last name"
                        /> */}
                  <Input {...field} id="last-name" placeholder="Last name" />
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
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm focus:ring-indigo-500 w-full sm:text-sm"
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
