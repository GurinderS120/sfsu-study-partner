import { useField } from "formik";

const TextAreaField = (props) => {
  const [field, meta] = useField(props);
  const { name, type, placeholder } = props;

  return (
    <textarea
      rows="4"
      cols="50"
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

export default TextAreaField;
