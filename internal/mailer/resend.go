// Package mailer sends transactional email through Resend.
package mailer

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const resendEndpoint = "https://api.resend.com/emails"

// Client sends email via the Resend API.
type Client struct {
	APIKey   string // Resend API key (re_...)
	From     string // e.g. "Site <noreply@example.com>"; domain must be verified in Resend
	SiteName string
	Endpoint string // optional override, defaults to Resend
	HTTP     *http.Client
}

type sendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
	Text    string   `json:"text"`
}

// SendVerificationCode emails the signup verification code to the recipient.
func (c *Client) SendVerificationCode(ctx context.Context, to, code string, expireMinutes int) error {
	subject, html, text, err := RenderVerify(VerifyData{SiteName: c.SiteName, Code: code, ExpireMinutes: expireMinutes})
	if err != nil {
		return err
	}
	body, err := json.Marshal(sendRequest{From: c.From, To: []string{to}, Subject: subject, HTML: html, Text: text})
	if err != nil {
		return err
	}
	ep := c.Endpoint
	if ep == "" {
		ep = resendEndpoint
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, ep, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	hc := c.HTTP
	if hc == nil {
		hc = &http.Client{Timeout: 15 * time.Second}
	}
	resp, err := hc.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode/100 != 2 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		return fmt.Errorf("resend: status %d: %s", resp.StatusCode, b)
	}
	return nil
}
