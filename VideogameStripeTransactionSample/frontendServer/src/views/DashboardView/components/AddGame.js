import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddGame = ({ onAdd }) => {
  const [game, setGame] = useState("");
  const [publisher, setPublisher] = useState("");
  const [release, setRelease] = useState("");
  const [genre, setGenre] = useState("");
  const [reminder, setShortcut] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!game) {
      alert("Please enter a game.");
      return;
    }

    onAdd({ game, publisher, release, genre, reminder });

    setGame("");
    setPublisher("");
	setRelease("");
	setGenre("");
    setShortcut(false);
  };

  return (
   <>
     <Form onSubmit={onSubmit}>
	   <Form.Group className="mb-3" controlId="formBasicEmail">
         <Form.Label>Game</Form.Label>
           <Form.Control
		     type="text"
             placeholder="Add game"
             value={game}
             onChange={(e) => setGame(e.target.value)}
		   />
       </Form.Group>
	   
	   <Form.Group className="mb-3" controlId="formBasicPassword">
         <Form.Label>Publisher</Form.Label>
           <Form.Control
			 type="text"
             placeholder="Add publisher"
             value={publisher}
             onChange={(e) => setPublisher(e.target.value)}
           />
		 </Form.Group>
	  
	   <Form.Group className="mb-3" controlId="formBasicPassword">
         <Form.Label>Release</Form.Label>
           <Form.Control
             type="text"
             placeholder="Add release date"
             value={release}
             onChange={(e) => setRelease(e.target.value)}
           />
		 </Form.Group>
		
	   <Form.Group className="mb-3" controlId="formBasicPassword">
         <Form.Label>Genre</Form.Label>
           <Form.Control
             type="text"
             placeholder="Add genre"
             value={genre}
             onChange={(e) => setGenre(e.target.value)}
          />
        </Form.Group>
		
		<Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
		    label="Create Shortcut"
            type="checkbox"
            checked={reminder}
            value={reminder}
            onChange={(e) => setShortcut(e.currentTarget.checked)}
          />
        </Form.Group>
		
		<Button variant="primary" type="submit">
          Install Game
        </Button>
      </Form>
	</>
  );
};

export default AddGame;
