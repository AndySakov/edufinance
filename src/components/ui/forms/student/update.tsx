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
import { Student, User } from "@/shared/types/user";
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
import { format, formatISO, isAfter, parse } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Programme } from "@/shared/types/programme";
import { toast } from "@/components/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  middleName: z
    .string()
    .min(2, { message: "Middle name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  gender: z.enum(["male", "female"], {
    message: "Gender must be either male or female",
  }),
  nationality: z
    .string()
    .min(1, { message: "Nationality must be at least 1 character" }),
  phoneNumber: z
    .string()
    .regex(/^\+234(90[0-9]|80[0-9]|81[0-9]|70[0-9]|91[0-9])\d{7}$/, {
      message: "Phone number must be a valid Nigerian phone number",
    })
    .min(14, { message: "Phone number must be exactly 14 characters" })
    .max(14, { message: "Phone number must be exactly 14 characters" }),
  dateOfBirth: z
    .string()
    .refine(
      (val) => isAfter(new Date(), parse(val, "dd/MM/yyyy", new Date())),
      {
        message: "Date of birth must be in the past",
      }
    ),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  zipCode: z
    .string()
    .min(5, { message: "Zipcode must be at least 5 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  programmeId: z
    .string()
    .min(1, { message: "Programme must be at least 1 character" }),
});

export interface UpdateStudentFormProps {
  student?: Student;
}

export function UpdateStudentForm({ student }: UpdateStudentFormProps) {
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
      ...student,
      dateOfBirth: student?.dateOfBirth
        ? format(student?.dateOfBirth, "dd/MM/yyyy")
        : "",
      programmeId: student?.programme ?? "",
    },
    mode: "all",
  });

  if (typeof student === "undefined") {
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
      .patch<ResponseWithOptionalData<User>>(`/students/${params.id}`, {
        ...values,
        dateOfBirth: formatISO(
          parse(values.dateOfBirth, "dd/MM/yyyy", new Date())
        ),
        programmeId: programmes
          ?.find((programme) => programme.name === values.programmeId)
          ?.id.toString(),
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
            Update this student's personal information here.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 mt-4">
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
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Middle name
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
                          id="middle-name"
                          placeholder="Middle name"
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
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 mt-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Gender
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="gender"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter gender"
                        /> */}
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue
                              {...field}
                              id="gender"
                              placeholder="Select gender"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Nationality
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
                              id="nationality"
                              placeholder="Select nationality"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nigerian">Nigerian</SelectItem>
                          </SelectContent>
                        </Select>
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
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Address
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="address"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter address"
                        /> */}
                        <Input {...field} id="address" placeholder="Address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        City
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="city"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter city"
                        /> */}
                        <Input {...field} id="city" placeholder="City" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Zipcode
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="Zipcode"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter Zipcode"
                        /> */}
                        <Input {...field} id="Zipcode" placeholder="Zipcode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Country
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="country"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter country"
                        /> */}
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue
                              {...field}
                              id="country"
                              placeholder="Select country"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        State
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
                              id="state"
                              placeholder="Select state"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Abia">Abia</SelectItem>
                            <SelectItem value="Adamawa">Adamawa</SelectItem>
                            <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                            <SelectItem value="Anambra">Anambra</SelectItem>
                            <SelectItem value="Bauchi">Bauchi</SelectItem>
                            <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                            <SelectItem value="Benue">Benue</SelectItem>
                            <SelectItem value="Borno">Borno</SelectItem>
                            <SelectItem value="Cross River">
                              Cross River
                            </SelectItem>
                            <SelectItem value="Delta">Delta</SelectItem>
                            <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                            <SelectItem value="Edo">Edo</SelectItem>
                            <SelectItem value="Ekiti">Ekiti</SelectItem>
                            <SelectItem value="Enugu">Enugu</SelectItem>
                            <SelectItem value="FCT (Federal Capital Territory)">
                              FCT (Federal Capital Territory)
                            </SelectItem>
                            <SelectItem value="Gombe">Gombe</SelectItem>
                            <SelectItem value="Imo">Imo</SelectItem>
                            <SelectItem value="Jigawa">Jigawa</SelectItem>
                            <SelectItem value="Kaduna">Kaduna</SelectItem>
                            <SelectItem value="Kano">Kano</SelectItem>
                            <SelectItem value="Katsina">Katsina</SelectItem>
                            <SelectItem value="Kebbi">Kebbi</SelectItem>
                            <SelectItem value="Kogi">Kogi</SelectItem>
                            <SelectItem value="Kwara">Kwara</SelectItem>
                            <SelectItem value="Lagos">Lagos</SelectItem>
                            <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                            <SelectItem value="Niger">Niger</SelectItem>
                            <SelectItem value="Ogun">Ogun</SelectItem>
                            <SelectItem value="Ondo">Ondo</SelectItem>
                            <SelectItem value="Osun">Osun</SelectItem>
                            <SelectItem value="Oyo">Oyo</SelectItem>
                            <SelectItem value="Plateau">Plateau</SelectItem>
                            <SelectItem value="Rivers">Rivers</SelectItem>
                            <SelectItem value="Sokoto">Sokoto</SelectItem>
                            <SelectItem value="Taraba">Taraba</SelectItem>
                            <SelectItem value="Yobe">Yobe</SelectItem>
                            <SelectItem value="Zamfara">Zamfara</SelectItem>
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Phone number
                      </FormLabel>
                      <FormControl {...field}>
                        {/* <input
                          {...field}
                          type="text"
                          id="phone"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter phone number"
                        /> */}
                        <Input
                          {...field}
                          id="phone"
                          placeholder="Phone number"
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-medium text-gray-700 text-sm">
                        Date of birth
                      </FormLabel>
                      <FormControl {...field}>
                        <div className="relative mt-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="relative mt-1">
                                <Input
                                  {...field}
                                  value={form?.getValues()?.dateOfBirth}
                                  onChange={field.onChange}
                                  id="dateOfBirth"
                                  className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                                  placeholder="Enter Date of Birth"
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
