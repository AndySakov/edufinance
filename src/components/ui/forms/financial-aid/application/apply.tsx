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
import { ResponseWithNoData } from "@/shared/types/data";
import { useClient } from "@/shared/axios";
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";
import FormUpload from "@/components/ui/upload";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  householdIncome: z.string().refine((val) => Number(val) >= 1, {
    message: "Household income must be at least 1 naira",
  }),
  hasReceivedPreviousFinancialAid: z.string().min(4, {
    message:
      "Has received previous financial aid must be at least 4 characters",
  }),
  bankStatement: z
    .instanceof(File)
    .refine((file) => file, "Bank statement is required.")
    .refine((file) => {
      return file ? file?.size <= MAX_FILE_SIZE : false;
    }, `Max file size is 5MB.`)
    .refine((file) => {
      return file ? ACCEPTED_FILE_TYPES.includes(file?.type) : false;
    }, "Only .jpg, .jpeg, .png, .pdf, .doc and .docx files are accepted."),
  letterOfRecommendation: z
    .instanceof(File)
    .refine((file) => file, "Letter of recommendation is required.")
    .refine((file) => {
      return file ? file?.size <= MAX_FILE_SIZE : false;
    }, `Max file size is 5MB.`)
    .refine((file) => {
      return file ? ACCEPTED_FILE_TYPES.includes(file?.type) : false;
    }, "Only .jpg, .jpeg, .png, .pdf, .doc and .docx files are accepted."),
  coverLetter: z
    .instanceof(File)
    .refine((file) => file, "Cover letter is required.")
    .refine((file) => {
      return file ? file?.size <= MAX_FILE_SIZE : false;
    }, `Max file size is 5MB.`)
    .refine((file) => {
      return file ? ACCEPTED_FILE_TYPES.includes(file?.type) : false;
    }, "Only .jpg, .jpeg, .png, .pdf, .doc and .docx files are accepted."),
});

export function FinancialAidApplicationForm() {
  const client = useClient();

  type ThisForm = z.infer<typeof formSchema>;

  const form = useForm<ThisForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const bankStatementInputState = useState<HTMLInputElement | null>(null);
  const bankStatementRegister = form.register("bankStatement");
  const letterOfRecommendationInputState = useState<HTMLInputElement | null>(
    null
  );
  const letterOfRecommendationRegister = form.register(
    "letterOfRecommendation"
  );
  const coverLetterInputState = useState<HTMLInputElement | null>(null);
  const coverLetterRegister = form.register("coverLetter");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("householdIncome", values.householdIncome);
    formData.append(
      "hasReceivedPreviousFinancialAid",
      values.hasReceivedPreviousFinancialAid
    );
    formData.append("bankStatement", values.bankStatement);
    formData.append("letterOfRecommendation", values.letterOfRecommendation);
    formData.append("coverLetter", values.coverLetter);
    client
      .post<ResponseWithNoData>(`/student/financial-aid/apply`, formData)
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
          console.log("Financial Aid Application Submitted");
        } else {
          console.log("Error submitting financial aid application");
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
        <div className="gap-4 grid grid-cols-1 mt-4">
          <FormField
            control={form.control}
            name="householdIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Annual Household Income (Naira)
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <Input
                      {...field}
                      type="number"
                      id="householdIncome"
                      className="block border-gray-300 focus:border-indigo-500 shadow-sm rounded-sm w-full sm:text-sm"
                      placeholder="Enter Household Income"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasReceivedPreviousFinancialAid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Have You Received Previous Financial Aid?
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          {...field}
                          id="hasReceivedPreviousFinancialAid"
                          placeholder="Select"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="gap-4 grid py-4">
          <FormField
            control={form.control}
            name="bankStatement"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="block font-medium text-gray-700 text-sm">
                      Bank Statement
                    </FormLabel>
                    <FormControl>
                      <FormUpload<ThisForm, "bankStatement">
                        name="bankStatement"
                        header="Upload Bank Statement"
                        controllerProps={field}
                        register={bankStatementRegister}
                        state={bankStatementInputState}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="letterOfRecommendation"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="block font-medium text-gray-700 text-sm">
                      Letter of Recommendation
                    </FormLabel>
                    <FormControl>
                      <FormUpload<ThisForm, "letterOfRecommendation">
                        name="letterOfRecommendation"
                        header="Upload Letter of Recommendation"
                        controllerProps={field}
                        register={letterOfRecommendationRegister}
                        state={letterOfRecommendationInputState}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="block font-medium text-gray-700 text-sm">
                      Cover Letter
                    </FormLabel>
                    <FormControl>
                      <FormUpload<ThisForm, "coverLetter">
                        name="coverLetter"
                        header="Upload Cover Letter"
                        controllerProps={field}
                        register={coverLetterRegister}
                        state={coverLetterInputState}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
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
