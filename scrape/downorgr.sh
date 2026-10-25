
#!/bin/bash

a="datausercook.txt"
b="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36"
c="https://downr.org/"
read -rp "Masukkan link: " d

if [[ -z "$d" ]]; then
    echo "Ndak Boleh kosong url nya"
    exit 1
fi
echo "Bentar yaa..."
curl -s -X POST "https://downr.org/.netlify/functions/analytics" \
    -H "User-Agent: $b" \
    -H "Referer: $c" \
    -c "$a" \
    --compressed > /dev/null

echo "dikit lagi"
curl -s -X POST "https://downr.org/.netlify/functions/bbc" \
    -H "Content-Type: application/json" \
    -H "User-Agent: $b" \
    -H "Referer: $c" \
    -b "$a" \
    -c "$a" \
    --data-raw "$(printf '%s' "$d" | jq -Rs '{url: .}')" \
    --compressed
rm -f "$a"
echo -e "\nSelesai!"
