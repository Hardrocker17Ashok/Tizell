const functions = require("firebase-functions");
const crypto = require("crypto");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();


exports.createPayUPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { txnid, amount, productinfo, firstname, email, udf1 } = req.body;

      if (!txnid || !amount || !firstname || !email || !udf1)
        return res.status(400).json({ error: "Missing fields" });

      const key = "Bt11Y4";
      const salt = "FmaBHiKXPRK2ARzfZxJcMKyUY4wwUzwV";

      const hashString =
        `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${salt}`;

      const hash = crypto.createHash("sha512").update(hashString).digest("hex");

      res.json({
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1,
        surl: "https://us-central1-myshope-1ff26.cloudfunctions.net/paymentSuccess",
        furl: "https://us-central1-myshope-1ff26.cloudfunctions.net/paymentFailure",
        service_provider: "payu_paisa",
        hash,
      });
    } catch (e) {
      res.status(500).json({ error: "Payment init failed" });
    }
  });
});


exports.paymentSuccess = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { txnid, udf1, amount } = req.body;

    await admin.firestore().collection("orders").doc(txnid).update({
      paymentStatus: "SUCCESS",
      paymentMode: "ONLINE",
      amount,
      paidAt: new Date(),
    });

    const cartSnap = await admin
      .firestore()
      .collection("cart")
      .where("userId", "==", udf1)
      .get();

    cartSnap.forEach(d => d.ref.delete());

    res.redirect(`https://tizell.com/order-success?orderId=${txnid}`);
  });
});

exports.paymentFailure = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { txnid } = req.body;

    await admin.firestore().collection("orders").doc(txnid).delete();

    res.redirect(`https://tizell.com/payment-failed`);
  });
});
