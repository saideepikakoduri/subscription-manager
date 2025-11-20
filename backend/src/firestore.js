import { Firestore } from "@google-cloud/firestore";

const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
});

export async function saveSubscription(data) {
  await db.collection("subscriptions").add({
    ...data,
    createdAt: new Date(),
    source: "gmail"
  });
}

export async function addManual(data) {
  await db.collection("subscriptions").add({
    ...data,
    createdAt: new Date(),
    source: "manual"
  });
}

export async function getAllSubscriptions() {
  const snapshot = await db.collection("subscriptions").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
