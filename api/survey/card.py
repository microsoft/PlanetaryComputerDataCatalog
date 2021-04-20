import copy

card_definition = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "0076D7",
    "summary": "A new Planetary Computer account request was recieved",
    "sections": [
        {
            "activityTitle": "New Account Request",
            "activitySubtitle": "Planetary Computer",
            "activityImage": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE39jNE",
            "text": "**Please review**: A new Planetary Computer account request was recieved.",
            "markdown": True,
            "potentialAction": [
                {
                    "@type": "OpenUri",
                    "name": "View on Portal",
                    "targets": [{"os": "default", "uri": ""}],
                }
            ],
        }
    ],
}


def make_card(portal_url: str):
    card = copy.deepcopy(card_definition)
    sections = card["sections"][0]
    sections["potentialAction"][0]["targets"][0]["uri"] = portal_url
    return card
