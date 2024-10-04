import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { Label } from "./ui/label";
import PasswordInputField from "./PasswordInputField";

interface FormInputFieldProps {
  // Define your props here
  control: any;
  name: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  type?: string;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  control,
  name,
  placeholder,
  label,
  required,
  className,
  type,
}) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <FormField
        control={control}
        name={name}
        render={({ field, formState }) => (
          <FormItem className={cn(className)}>
            <FormControl>
              {type === "password" ? (
                <>
                  <PasswordInputField field={field} placeholder={placeholder} />
                </>
              ) : (
                <Input
                  {...field}
                  placeholder={placeholder}
                  required={required}
                />
              )}
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormInputField;
