const envVariables: Record<string, any> = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

export const getEnvVariable = <T>({
  name,
}: {
  name: keyof typeof envVariables;
}): T | undefined => {
  const envVariable = envVariables[name];
  return envVariable;
};
