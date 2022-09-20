import { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import Games from "./components/Games";
import AddGame from "./components/AddGame";
import useAuth from "../../hook/useAuth";
import useSubscription from "../../hook/useSubscription";
import useIsMountedRef from "../../hook/useIsMountedRef";
import Error from "../../components/Error";

const DashboardView = () => {
  const { user, logout } = useAuth();
  const isMountedRef = useIsMountedRef();

  const [error, setError] = useState(null);

  const [showAddGame, setShowAddGame] = useState(false);
  const [tasks, setGames] = useState([]);
  
  const subscription = useSubscription();
  
  const queryClient = useQueryClient();
  
  const fetchGamesServer = async () => {
    const token = await user.getIdToken();
    const res = await fetch(process.env.REACT_APP_SERVER_URL + "/games", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
    });

    const data = await res.json();
    return data.result;
  };

  useEffect(() => {
    const getGames = async () => {
      try {
        const gamesFromServer = await fetchGamesServer();
        if (isMountedRef.current) setGames(gamesFromServer);
      } catch (err) {
        setError(err.message);
      }
    };

    getGames();
  }, []);

  const addGameServer = async (task) => {
    const token = await user.getIdToken();
    const res = await fetch(process.env.REACT_APP_SERVER_URL + "/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: task }),
      });

    const data = await res.json();
    return data.result;
  };

  const addGame = async (task) => {
    try {
      const data = await addGameServer(task);
      if (isMountedRef.current) setGames([...tasks, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteGameServer = async (id) => {
    const token = await user.getIdToken();
    const res = await fetch(process.env.REACT_APP_SERVER_URL + `/games/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    return res.status;
  };

  // Delete Task
  const deleteGame = async (id) => {
    try {
      const status = await deleteGameServer(id);

      if (status === 200 && isMountedRef.current) 
		setGames(tasks.filter((task) => task.id !== id));
      else throw new Error("Error uninstalling this game");
    } catch (err) {
      setError(err.message);
    }
  };

  // update reminder server
  const updateShortcutServer = async (id, reminder) => {
    const token = await user.getIdToken();
    const res = await fetch(process.env.REACT_APP_SERVER_URL + `/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reminder: !reminder }),
      });

    const data = await res.json();
    return data.result;
  };

  // update reminder
  const updateShortcut = async (id, reminder) => {
    try {
      const data = await updateShortcutServer(id, reminder);

      setGames(
        tasks.map((task) =>
          task.id === id ? { ...task, reminder: data.reminder } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  const [clientSecret, setClientSecret] = useState(null);

  const createSubscriptionServer = async () => {
    const token = await user.getIdToken();
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/subscription/stripe/create`,
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

  const createSubscriptionFront = async () => {
    let response = await createSubscriptionServer();
    setClientSecret(response.clientSecret);
  };

  const cancelSubscriptionServer = async () => {
    const token = await user.getIdToken();
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/subscription/stripe/cancel`,
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

  const cancelSubscriptionFront = async () => {
    let response = await cancelSubscriptionServer();
	queryClient.invalidateQueries("getSubscription");
    return response;
  };
  
  const getUserInfo = () => {
    let message = "";

    if (
      subscription &&
      subscription.tier === "premium" &&
      (subscription.canceled === null || subscription.canceled === undefined)
    )
      message = (
        <p>
          Your subscription is being processed. You can refresh the page in a
          minute.
        </p>
      );
    else if (
      subscription &&
      subscription.tier === "premium" &&
      subscription.canceled
    )
      message = (
        <p>
          Your subscription is canceled but you can still use the premium
          service till {subscription.renewTime.split("T")[0]}.
        </p>
      );
    else if (
      subscription &&
      subscription.tier === "premium" &&
      subscription.canceled === false
    )
      message = <p>Welcome premium user!</p>;

    return message;
  };

  if (user === null || user === undefined)
    return <Navigate to={{ pathname: "/" }} />;

  if (clientSecret)
    return <Navigate to="/checkout" state={{ clientSecret: clientSecret }} />;

  return (
    <div className="container">
      <Header
		subscription={subscription}
        onAdd={() => setShowAddGame(!showAddGame)}
		onSubscription={createSubscriptionFront}
		onCancel={cancelSubscriptionFront}
        showAdd={showAddGame}
        logout={logout}
      />
	  
	  {getUserInfo()}
	  
	  {showAddGame && <AddGame onAdd={addGame} />}

      {tasks.length > 0 ? (
        <Games tasks={tasks} onDelete={deleteGame} onToggle={updateShortcut} />
      ) : (
        "You have no games in your library."
      )}

      {error && <Error error={error} />}

    </div>
  );
};

export default DashboardView;