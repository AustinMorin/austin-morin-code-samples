const { db } = require("../../utils/admin");

exports.getGames = async (req, res) => {
	const email = req.user.email;
	
	let result = [];
	
	let gameCollection = await db.collection(`/users/${email}/games`).get();
	
    for (let doc of gameCollection.docs) {
      result.push({
        id: doc.id,
        ...doc.data(),
      });
    }
    return res.status(200).json({ result: result });
};

exports.getGame = async (req, res) => {
	const email = req.user.email;
	
	let id = req.params.id;
	
	let gameDoc = await db.doc(`/users/${email}/games/${id}`).get();
	if (!gameDoc.exists) return res.status(200).json({ result: {} });
	
    let result = gameDoc.data();
    result.id = gameDoc.id;
	
	return res.status(200).json({ result: result });
};

exports.addGame = async (req, res) => {
	const email = req.user.email;
	
    let task = req.body.task;
	
    let gameDoc = db.collection(`/users/${email}/games`).doc();
    gameDoc.set({
      game: task.game,
      publisher: task.publisher,
      release: task.release,
	  genre: task.genre,
	  reminder: task.reminder,
    });
    task.id = gameDoc.id;

    return res.status(200).json({ result: task });
};

exports.updateGame = async (req, res) => {
	const email = req.user.email;
	
    let id = req.params.id;
    let reminder = req.body.reminder;
	
    let gameDocRef = db.doc(`/users/${email}/games/${id}`);
    await gameDocRef.update({
      reminder: reminder,
    });
	
    let gameDoc = await gameDocRef.get();
    let result = gameDoc.data();
    result.id = gameDoc.id;
    return res.status(200).json({ result: result });
};

exports.deleteGame = async (req, res) => {
	const email = req.user.email;
	let id = req.params.id;
	
    let gameDocRef = db.doc(`/users/${email}/games/${id}`);
    await gameDocRef.delete();
	
    return res.status(200).json({ result: true });
};
