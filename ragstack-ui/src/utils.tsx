export const upsertFile = async (
  formData: FormData,
  apiKey: string
): Promise<string | null> => {
  try {
    console.log(formData);
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/upsert-files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error upserting files: ${error.message}`);
    return error;
  }
};

export const getBotResponse = async (
  input: string,
  apiKey: string
): Promise<any | null> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/ask-question",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ question: input }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error upserting files: ${error.message}`);
    return error;
  }
};

export const getFilePreviews = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-previews",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data.previews;
  } catch (error: any) {
    console.error(`Error getting file previews: ${error.message}`);
    return error;
  }
};

export const getFile = async (
  fileName: string,
  apiKey: string
): Promise<any> => {
  try {
    console.log("file name:", fileName);
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-file",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ file_name: fileName }),
      }
    );
    const data = await response.json();
    console.log(data);
    return data.signed_url;
  } catch (error: any) {
    console.error(`Error getting file: ${error.message}`);
    return error;
  }
};
