export const upsertFile = async (formData: FormData, apiKey: string): Promise<string | null> => {
  try {
    console.log(formData)
    const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + '/upsert-files', { 
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData 
    })
    const data = await response.json();
    return data
  } catch (error: any) {
    console.error(
      `Error upserting files: ${error.message}`
    );
    return error;
  }

}

export const getBotResponse = async (input: string, apiKey: string): Promise<string | null> => {
  try {
    console.log(input)
    const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + '/ask-question', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({'question': input})
    })
    const data = await response.json();
    return data.answer
  } catch (error: any) {
    console.error(
      `Error upserting files: ${error.message}`
    );
    return error;
  }

}