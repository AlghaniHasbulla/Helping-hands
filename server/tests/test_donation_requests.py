
def test_create_donation_request(client, ngo_token):
    headers = {
        "Authorization": f"Bearer {ngo_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "title": "Test Request",
        "description": "We need help with food.",
        "category_id": 1,
        "amount_requested": 5000.0
    }

    response = client.post("/requests", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json["title"] == "Test Request"
