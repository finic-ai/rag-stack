const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL

export const upsertFile = async (formData: FormData): Promise<string | null> => {
  try {
    console.log(formData)
    const response = await fetch(SERVER_URL + '/upsert-files', { method: 'POST', body: formData })
    const data = await response.json();
    return data
  } catch (error: any) {
    console.error(
      `Error upserting files: ${error.message}`
    );
    return error;
  }
}

export const askQuestion = async (question: string): Promise<any> => {
  try {
    const response = await fetch(SERVER_URL + '/ask-question', {
      method: 'POST',
      body: JSON.stringify({
        question: question
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(
      `Error asking question: ${error.message}`
    );
    return error;
  }
}