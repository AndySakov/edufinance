import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  // useFormContext,
  UseFormRegisterReturn,
} from "react-hook-form";
import { UploadIcon } from "@radix-ui/react-icons";

export type FormWithUpload = {
  [x: string]: FileList;
};

export type FormUploadProps<A extends FieldValues, B extends Path<A>> = {
  name: B;
  header: string;
  controllerProps: ControllerRenderProps<A, B>;
  register: UseFormRegisterReturn<B>;
  state: [
    HTMLInputElement | null,
    React.Dispatch<React.SetStateAction<HTMLInputElement | null>>
  ];
};

const FormUpload = <A extends FieldValues, B extends Path<A>>({
  // name,
  header,
  controllerProps,
  register,
  state,
}: FormUploadProps<A, B>) => {
  const { ref: formRef, ...formRest } = register;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value: _, ...props } = controllerProps;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // console.log("Files selected: ", e.target.files);
      controllerProps.onChange(e.target.files[0] as unknown as PathValue<A, B>);
    } else {
      console.log("No files selected.");
    }
  };

  return (
    <div
      className="border-2 border-gray-300 p-4 border-dashed rounded-md text-center cursor-pointer"
      onClick={() => state[0]?.click()}
    >
      <input
        type="file"
        className="hidden"
        {...props}
        {...formRest}
        ref={(e) => {
          state[1](e);
          formRef(e);
        }}
        onChange={handleFileChange}
      />
      <UploadIcon className="mx-auto mb-2 w-6 h-6" />
      <p>{header}</p>
      <p className="text-muted-foreground text-sm">
        (.jpg, .jpeg, .png, .pdf, .doc, or .docx file format supported)
      </p>
      <p className="text-muted-foreground text-sm">Max file size: 5MB</p>
    </div>
  );
};

export default FormUpload;
