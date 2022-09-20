import { FaTrashAlt } from "react-icons/fa";

const Game = ({ task, onDelete, onToggle }) => {
  return (
    <div
      className={`task ${task.reminder && "reminder"}`}
      onDoubleClick={() => onToggle(task.id, task.reminder)}
    >
      <h3>
        {task.game}{" "}
        <FaTrashAlt
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => onDelete(task.id)}
        />
      </h3>
	  <p>{task.publisher}</p>
	  <p>{task.release}</p>
	  <p>{task.genre}</p>
    </div>
  );
};

export default Game;
