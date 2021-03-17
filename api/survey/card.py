import copy

card_definition = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "0076D7",
    "summary": "A new Planetary Computer account request was recieved",
    "sections": [
        {
            "activityTitle": "New Account Request Received",
            "activitySubtitle": "Planetary Computer",
            "activityImage": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE39jNE",
            "facts": [{"name": "RowKey", "value": "<unset>"}],
            "markdown": True,
        }
    ],
}


def make_card(row_code: str):
    card = copy.deepcopy(card_definition)
    card["sections"][0]["facts"][0]["value"] = row_code
    return card
