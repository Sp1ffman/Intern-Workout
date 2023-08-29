export default function validation(value1, value2) {
  let error = {};
  if (value1 === "") error.email = "This field should not be empty";
  else if (value1) {
    error.email = " ";
  }
  if (value2 === "") error.password = "This field should not be empty";
  else if (value2) {
    error.password = "";
  }
  return error;
}
