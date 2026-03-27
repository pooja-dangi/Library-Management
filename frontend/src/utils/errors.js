export const getApiErrorMessage = (err, fallback = "Request failed") => {
  return (
    err?.response?.data?.message ||
    (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors[0]?.msg : "") ||
    fallback
  );
};

