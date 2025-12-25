function calculateAge(birthDateString:Date) {
 
  const birthDate = new Date(birthDateString);
  const currentDate = new Date();
 
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth() - birthDate.getMonth();

 
  if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

 
  return age;
}

 
 export default calculateAge

 
