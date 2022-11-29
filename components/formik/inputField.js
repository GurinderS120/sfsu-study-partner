import { useField } from "formik";

const InputField = (props) => {
  const [field, meta] = useField(props);
  const { name, type, placeholder } = props;

  return (
    <input
      className={`${
        meta.touched ? (meta.error ? "is-invalid " : "is-valid ") : ""
      }form-control mt-3`}
      {...field}
      name={name}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default InputField;
