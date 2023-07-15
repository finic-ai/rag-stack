export const upsertFile = async (formData: FormData): Promise<string | null> => {
  try {
    console.log(formData)
    const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + '/upsert-files', { method: 'POST', body: formData })
    const data = await response.json();
    return data
  } catch (error: any) {
    console.error(
      `Error upserting files: ${error.message}`
    );
    return error;
  }

}