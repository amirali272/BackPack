package mailer

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSendVerificationCode(t *testing.T) {
	var got sendRequest
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer re_test" {
			t.Errorf("bad auth header")
		}
		json.NewDecoder(r.Body).Decode(&got)
		w.WriteHeader(200)
	}))
	defer srv.Close()
	c := &Client{APIKey: "re_test", From: "a@b.c", SiteName: "سایت", Endpoint: srv.URL}
	if err := c.SendVerificationCode(context.Background(), "u@x.y", "123456", 10); err != nil {
		t.Fatal(err)
	}
	if got.To[0] != "u@x.y" || !strings.Contains(got.HTML, "123456") || !strings.Contains(got.HTML, `dir="rtl"`) {
		t.Fatalf("unexpected payload: %+v", got)
	}
}

func TestSendError(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(403) }))
	defer srv.Close()
	c := &Client{Endpoint: srv.URL}
	if c.SendVerificationCode(context.Background(), "u@x.y", "1", 1) == nil {
		t.Fatal("expected error")
	}
}
