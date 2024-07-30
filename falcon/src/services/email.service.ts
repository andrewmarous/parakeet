import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const emailService = {
  async sendEditedResponse({
    studentEmail,
    courseCode,
    originalRespones,
    editedResponse,
    question,
  }: {
    studentEmail: string;
    courseCode: string;
    originalRespones: string;
    editedResponse: string;
    question: string;
  }) {
    const msg = {
      to: "test@example.com", // Change to your recipient
      from: "test@example.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  },

  async verify() {
    const msg = {
      to: "zachary.h.a@gmail.com", // Change to your recipient
      from: "tommy@tryparakeet.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  },
};

export default emailService;
