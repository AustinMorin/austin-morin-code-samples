import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import useIsMountedRef from "../../../hook/useIsMountedRef";

const Header = ({ 
  subscription,
  onAdd,
  onSubscription,
  onCancel,
  showAdd,
  logout, 
}) => {
	// loading states
  const [upgradeIsLoading, setUpgradeLoading] = useState(false);
  const isMountedRef = useIsMountedRef();

  // update loading states
  useEffect(() => {
    if (upgradeIsLoading) {
      onSubscription().then(() => {
        if (isMountedRef.current) setUpgradeLoading(false);
      });
    }
  }, [upgradeIsLoading]);
  
  return (
    <header className="header">
      <h2>Add a Task</h2>
      <Button variant="primary" onClick={onAdd}>
        {showAdd ? "Close" : "Add"}
      </Button>
      {subscription && subscription.tier === "free" && (
        <Button 
		  variant="primary"
		  disabled={upgradeIsLoading}
		  onClick={() => setUpgradeLoading(true)}
		>
		  {upgradeIsLoading ? "Loading…" : "Upgrade"}
        </Button>
      )}
      {subscription &&
        subscription.tier === "premium" &&
        subscription.canceled === false && (
          <Button variant="primary" onClick={() => onCancel()}>
            Downgrade
          </Button>
        )}
      <Button variant="primary" onClick={() => logout()}>
        Logout
      </Button>
    </header>
  );
};

Header.defaultProps = {
  title: "AuTeam Game Installer",
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
