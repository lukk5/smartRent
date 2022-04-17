export const isEmail = (email: string): boolean => {
  if (email === null || email === undefined || email === "") return false;

  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return regexp.test(email);
};

export const isPassword = (password: string): boolean => {
  const passwReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
  return passwReg.test(password);
};

export const isPasswordMatch = (
  password: string,
  repeatPassword: string
): boolean => {
  return password === repeatPassword;
};

export const isPhone = (phone: string): boolean => {
  const phoneReg = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  );

  let result = phoneReg.test(phone);


  if(phone.length > 12 || phone.length < 9)
  {
      result = false;
  } 

  console.log(result);

  return result;
};
