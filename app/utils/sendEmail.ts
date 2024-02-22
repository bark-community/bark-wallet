/**
 * Opens the user's default email client with a pre-filled email.
 * @param {string} recipient - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body/content of the email.
 */
export function sendEmail(recipient: string, subject: string, message: string): void {
  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  
  const link = document.createElement('a');
  link.href = mailtoLink;
  link.target = '_blank';

  // Trigger the click event to open the default email client.
  link.click();
}
