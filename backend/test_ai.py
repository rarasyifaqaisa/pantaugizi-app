import httpx, base64, json

# Download gambar test
img_url = "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg"

print("📥 Downloading test image...")
img_response = httpx.get(img_url, follow_redirects=True, timeout=30)
image_b64    = base64.b64encode(img_response.content).decode("utf-8")
print(f"✅ Image downloaded ({len(img_response.content) // 1024} KB)")

print("\n🤖 Sending to AI endpoint...")
result = httpx.post(
    "http://localhost:8000/ai/detect",
    json={"image_base64": image_b64},
    timeout=30
)

print(f"\n📊 Status: {result.status_code}")
data = result.json()
print(json.dumps(data, indent=2, ensure_ascii=False))

if data.get("detected"):
    print(f"\n🎯 Top match: {data['candidates'][0]['name']}")
    print(f"   Confidence: {data['candidates'][0]['confidence'] * 100:.0f}%")
    print(f"   Kalori: {data['candidates'][0]['calories']} kcal/100g")
else:
    print("\n⚠️  Tidak ada makanan terdeteksi")
    print("Vision labels yang didapat:", data.get("vision_labels", []))