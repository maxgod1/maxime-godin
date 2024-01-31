export default function injectVariables(string: string, variables: any) {
  let newString = string;
  (Object.keys(variables || {}) || []).forEach((key) => {
    newString = newString.replace(new RegExp(`{{*${key}*}}`, "gi"), variables[key]);
  });
  return newString;
}
