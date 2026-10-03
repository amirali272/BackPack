package mailer

import (
	"bytes"
	"html/template"
)

// VerifyData holds the values rendered into the verification email.
type VerifyData struct {
	SiteName      string
	Code          string
	ExpireMinutes int
}

const verifySubject = "کد تایید ثبت‌نام"

var verifyHTML = template.Must(template.New("verify").Parse(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>کد تایید ثبت‌نام</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Tahoma,Vazirmatn,Arial,sans-serif;direction:rtl;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:8px;">
<tr><td align="center" style="padding:28px 24px 8px;font-size:20px;font-weight:bold;color:#111827;">{{.SiteName}}</td></tr>
<tr><td align="center" style="padding:8px 24px;font-size:15px;line-height:1.9;color:#374151;">
برای تکمیل ثبت‌نام، کد زیر را وارد کنید:
</td></tr>
<tr><td align="center" style="padding:12px 24px;">
<div dir="ltr" style="display:inline-block;background:#eef2ff;color:#3730a3;font-size:32px;font-weight:bold;letter-spacing:8px;padding:14px 28px;border-radius:8px;font-family:Consolas,Menlo,monospace;">{{.Code}}</div>
</td></tr>
<tr><td align="center" style="padding:8px 24px;font-size:13px;line-height:1.9;color:#6b7280;">
این کد تا {{.ExpireMinutes}} دقیقه معتبر است.
</td></tr>
<tr><td align="center" style="padding:8px 24px 28px;font-size:12px;line-height:1.9;color:#9ca3af;">
اگر شما درخواست ثبت‌نام نداده‌اید، این ایمیل را نادیده بگیرید.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`))

// RenderVerify returns the subject, HTML body and plain-text body.
func RenderVerify(d VerifyData) (subject, html, text string, err error) {
	var b bytes.Buffer
	if err = verifyHTML.Execute(&b, d); err != nil {
		return
	}
	text = d.SiteName + "\nکد تایید شما: " + d.Code + "\nاین کد تا " +
		itoa(d.ExpireMinutes) + " دقیقه معتبر است.\n"
	return verifySubject, b.String(), text, nil
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	var s []byte
	for ; n > 0; n /= 10 {
		s = append([]byte{byte('0' + n%10)}, s...)
	}
	return string(s)
}
