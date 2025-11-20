import { Firestore } from "@google-cloud/firestore";

const db = new Firestore();

export async function saveSubscription(data) {
  if (!data.service) return;
  await db.collection("subscriptions").add({
    ...data,
    createdAt: new Date()
  });
}

export async function addManual(data) {
  await db.collection("subscriptions").add({
    ...data,
    source: "manual",
    createdAt: new Date()
  });
}

export async function getAllSubscriptions() {
  const snapshot = await db.collection("subscriptions").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
