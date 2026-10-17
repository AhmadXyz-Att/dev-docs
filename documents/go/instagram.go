package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

type Media struct {
	Index int    `json:"index"`
	URL   string `json:"url"`
	Name  string `json:"name"`
	Type  string `json:"type"`
	Ext   string `json:"ext"`
}

type Meta struct {
	Title        string `json:"title"`
	Username     string `json:"username"`
	CommentCount int    `json:"commentCount"`
	LikeCount    int    `json:"likeCount"`
	TakenAt      int64  `json:"takenAt"`
}

type Result struct {
	Success   bool    `json:"success"`
	Source    string  `json:"source"`
	Shortcode string  `json:"shortcode"`
	Hosting   string  `json:"hosting"`
	Thumb     string  `json:"thumb"`
	SD        *string `json:"sd"`
	HD        *string `json:"hd"`
	Meta      Meta    `json:"meta"`
	Media     []struct {
		URL  string `json:"url"`
		Name string `json:"name"`
		Type string `json:"type"`
		Ext  string `json:"ext"`
	} `json:"media"`
	FetchedAt string `json:"fetchedAt"`
}

type UsageInfo struct {
	Remaining int `json:"remaining"`
	Limit     int `json:"limit"`
	TotalUsed int `json:"totalUsed"`
}

type APIResponse struct {
	Status    bool      `json:"status"`
	Creator   string    `json:"creator"`
	Endpoint  string    `json:"endpoint"`
	Result    Result    `json:"result"`
	UsageInfo UsageInfo `json:"usageInfo"`
	IsAdmin   bool      `json:"isAdmin"`
}

type Scrape struct {
	Status       bool      `json:"status"`
	Creator      string    `json:"creator"`
	Endpoint     string    `json:"endpoint"`
	Success      bool      `json:"success"`
	Source       string    `json:"source"`
	Shortcode    string    `json:"shortcode"`
	Hosting      string    `json:"hosting"`
	Thumb        string    `json:"thumb"`
	SD           *string   `json:"sd"`
	HD           *string   `json:"hd"`
	Title        string    `json:"title"`
	Username     string    `json:"username"`
	CommentCount int       `json:"commentCount"`
	LikeCount    int       `json:"likeCount"`
	TakenAt      int64     `json:"takenAt"`
	Media        []Media   `json:"media"`
	FetchedAt    string    `json:"fetchedAt"`
	Remaining    int       `json:"remaining"`
	Limit        int       `json:"limit"`
	TotalUsed    int       `json:"totalUsed"`
	IsAdmin      bool      `json:"isAdmin"`
	YourKey      string    `json:"yourKey"`
}

func ScrapeInstagram(rawURL string, apiKey string) (*Scrape, error) {
	if rawURL == "" {
		return nil, errors.New("URL wajib diisi")
	}

	endpoint := fmt.Sprintf(
		"https://api.fuku.eu.cc/api/igdl?api=%s&url=%s",
		apiKey,
		url.QueryEscape(rawURL),
	)

	client := &http.Client{Timeout: 30 * time.Second}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var api APIResponse
	if err := json.Unmarshal(body, &api); err != nil {
		return nil, err
	}

	media := make([]Media, 0, len(api.Result.Media))
	for i, m := range api.Result.Media {
		media = append(media, Media{
			Index: i + 1,
			URL:   m.URL,
			Name:  m.Name,
			Type:  m.Type,
			Ext:   m.Ext,
		})
	}

	scrape := &Scrape{
		Status:       api.Status,
		Creator:      api.Creator,
		Endpoint:     api.Endpoint,
		Success:      api.Result.Success,
		Source:       api.Result.Source,
		Shortcode:    api.Result.Shortcode,
		Hosting:      api.Result.Hosting,
		Thumb:        api.Result.Thumb,
		SD:           api.Result.SD,
		HD:           api.Result.HD,
		Title:        api.Result.Meta.Title,
		Username:     api.Result.Meta.Username,
		CommentCount: api.Result.Meta.CommentCount,
		LikeCount:    api.Result.Meta.LikeCount,
		TakenAt:      api.Result.Meta.TakenAt,
		Media:        media,
		FetchedAt:    api.Result.FetchedAt,
		Remaining:    api.UsageInfo.Remaining,
		Limit:        api.UsageInfo.Limit,
		TotalUsed:    api.UsageInfo.TotalUsed,
		IsAdmin:      api.IsAdmin,
		YourKey:      apiKey,
	}

	return scrape, nil
}
