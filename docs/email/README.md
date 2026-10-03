# Resend email templates

- Sending from Go (`internal/mailer`): the layout is rendered server-side and sent as raw `html` to the Resend API. No variables are needed in Resend.
- `resend-template.html`: the same layout for pasting into the Resend Templates editor. Variables use Resend's triple-brace syntax and must be declared in the template: `site_name`, `site_url`, `name`, `title`, `message`, `preheader`, `code`, `button_text`, `button_url`, `year`. When sending with a template, pass them in `variables`, and do not send `html`.
