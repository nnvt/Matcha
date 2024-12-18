import axios from '../utils/customize.axios';

// ? infoUpdate Action
export const infoUpdate = async (token, userInfos) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let editedData = Object.assign({}, userInfos);

  if (editedData.birthday) {
    let date = new Date(editedData.birthday._d);
    const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const m = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    const BD = y + "-" + m + "-" + d;
    editedData.birthday = BD;
  }
  editedData.tags = editedData.tags.map((item) => {
    return item.substring(1);
  });

  try {
    const res = await axios.patch(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/edit/informations",
      editedData,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

// ? Update password Action

export const changePassword = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.patch(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/edit/password",
      data,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

// ? LOCATION ACTION
export const changeLocation = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.patch(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/edit/location",
      data,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

// ? PROFILE ACTION
export const changeProfile = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  let form = new FormData();
  form.append("profile", data);
  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/images/profile/upload",
      form,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

// ? GALLERY ACTION
export const changeGallery = async (token, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  let form = new FormData();
  form.append("picture", data);
  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/images/upload",
      form,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

// ! Remove GALLERY ACTION
export const removeGallery = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.delete(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/images/delete/" + id,

      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? HISTORY  ACTION
export const historyAction = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.get(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/history/visits",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? BlackList  ACTION
export const blackListAction = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.get(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/find/black/list",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? Block   ACTION
export const blockAction = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/block/" + id,
      "",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};
// ? UNBlock   ACTION
export const unBlockAction = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/unblock/" + id,
      "",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? Report   ACTION
export const ReportAction = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/report/" + id,
      "",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? Like   ACTION
export const LikeAction = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/like/" + id,
      "",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};

// ? UnLike   ACTION
export const UnLikeAction = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.put(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/unlike/" + id,
      "",
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error?.response?.data;
  }
};