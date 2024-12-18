import axios from '../utils/customize.axios';

//* Notify Actions
export const notifyAction = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.get(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/notifications/list",
      config
    );
    if (res.data) return res?.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Set Notif Seen

export const setNotifSeen = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.patch(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/notifications/read/" + id,
      "",
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Delete Notif

export const deleteNotif = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.delete(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/notifications/delete/" + id,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Set All Notif Seen

export const setAllNotifSeen = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.patch(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/notifications/read",
      "",
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Delete All Notif

export const deleteAllNotif = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.delete(
      "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/notifications/delete",
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};