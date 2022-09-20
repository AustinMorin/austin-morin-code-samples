import { useQuery } from "react-query";
import useAuth from "./useAuth";

const useSubscription = () => {
  const { user } = useAuth();

  const getSubscriptionServer = async () => {
    const token = await user.getIdToken();
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + "/subscription",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return data.result;
  };

  const response = useQuery("getSubscription", async () => {
    if (user === null) return {data: null};
    
    let res = await getSubscriptionServer();
    return res;
  });

  return response.data;
};

export default useSubscription;