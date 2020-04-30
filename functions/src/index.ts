import * as Functions from "firebase-functions";
import * as Admin from "firebase-admin";

Admin.initializeApp();
const IC_DB = "https://mugambi-254.firebaseio.com/";
export const addProject = Functions.https.onRequest((req, res) => {
  const db = Admin.database().refFromURL(IC_DB);
  const project = req.body;
  const pRef = db.child("Projects").push();
  let id: string | null = pRef.key;
  while (id?.includes("-")) {
    id = id.replace("-", "pr");
  }
  while (id?.includes("_")) {
    id = id.replace("_", "id");
  }
  project.id = id;
  if (id) {
    db.child("Projects")
      .child(id)
      .set(project, () => {
        res.status(200).send(project);
      })
      .catch((e: Error) => {
        res.send(e);
      });
  } else {
    res.send("error");
  }
});

export const getProjects = Functions.https.onRequest((req, res) => {
  const db = Admin.database().refFromURL(IC_DB).child("Projects");
  db.once("value", (data) => {
    res.status(200).send(data);
  }).catch((e) => {
    res.send(e);
  });
});
