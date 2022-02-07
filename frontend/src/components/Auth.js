import axios from "axios";
import Cookies from "js-cookie";

// retrieve id from authentication package 3.1
// retrieve connect.sid from cookie first then attach to get request
export const getUID = async () => {
  const res = await axios({
    method: "get",
    url: "http://10.31.11.11:8090/session",
    withCredentials: true,
    headers: { Cookie: `connect.sid=${Cookies.get("connect.sid")}` },
  });
  let uid = res.data["userID"];
  return uid;
};

export default getUID;
