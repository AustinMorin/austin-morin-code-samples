import Game from "./Game";

const Games = ({ tasks, onDelete, onToggle }) => {
  return (
    <div className="games">
      {tasks.map((task, index) => (
        <Game key={index} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default Games;
