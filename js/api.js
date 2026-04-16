export const getData = async (url, onFail) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    onFail(error);
  }
};

export const sendData = async (url, onSuccess, onFail, body) => {
  try {
    const response = await fetch(url, {method: 'POST', body});

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    onSuccess();
  } catch(error) {
    onFail(error);
  }
};
