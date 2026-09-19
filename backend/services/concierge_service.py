from typing import Dict, Any

class ConciergeService:
    def answer_question(self, question: str, context: Dict[str, Any] = None) -> str:
        q = question.lower()

        if any(w in q for w in ["dress", "wear", "attire", "outfit", "clothes"]):
            if "mehendi" in q:
                return "For the Mehendi (10 Sep), the dress code is **Pastel / Floral**. Light, joyful colours are recommended."
            if "sangeet" in q:
                return "For the Sangeet (11 Sep), the dress code is **Cocktail / Festive Indian**. Bold, jewel-toned ethnic or cocktail attire is encouraged!"
            if any(w in q for w in ["wedding", "ceremony", "muhurtham"]):
                return "For the Wedding Ceremony (12 Sep, 9:30 AM), traditional South Indian attire is preferred: **Silk Sarees / Kanjeevaram** for ladies and **Dhoti / Kurta / Sherwani** for men."
            if "reception" in q:
                return "For the Grand Reception (12 Sep, 7:30 PM), the dress code is **Black Tie / Formal Indo-Western**."
            return "Event Dress Codes:\n• Mehendi: Pastel/Floral\n• Sangeet: Cocktail/Festive Indian\n• Ceremony: Traditional South Indian Silk\n• Reception: Black Tie/Formal."

        if any(w in q for w in ["where", "venue", "location", "place", "address", "map"]):
            if any(w in q for w in ["wedding", "ceremony", "mahabalipuram"]):
                return "The Wedding Ceremony is held at **Temple Gardens, Mahabalipuram** (Shore Temple Road). Shuttle buses depart ITC Grand Chola at 7:30 AM."
            return "Celebrations are hosted at **ITC Grand Chola, Chennai** (Mehendi, Sangeet, Reception) and **Temple Gardens, Mahabalipuram** (Wedding Ceremony)."

        if any(w in q for w in ["time", "timing", "when", "schedule"]):
            return "Event Schedule:\n• Mehendi: 10 Sep, 10:00 AM\n• Sangeet: 11 Sep, 7:00 PM\n• Ceremony: 12 Sep, 9:30 AM\n• Reception: 12 Sep, 7:30 PM."

        if any(w in q for w in ["park", "parking", "valet"]):
            return "Complimentary valet parking is available at both ITC Grand Chola and Temple Gardens Mahabalipuram for all wedding guests."

        if any(w in q for w in ["hotel", "stay", "room", "accommodation"]):
            return "Rooms have been reserved at **ITC Grand Chola** and **Radisson Resort Temple Bay**. Please connect with our hospitality desk at **+91 98765 43210**."

        if any(w in q for w in ["gift", "registry"]):
            return "Your presence, prayers, and blessings are our greatest gifts! We kindly request no boxed gifts."

        if any(w in q for w in ["food", "diet", "veg", "vegetarian", "jain", "dinner", "lunch"]):
            return "The wedding ceremony features a traditional South Indian vegetarian Kalyana Sappadu on plantain leaves. Sangeet and Reception feature extensive multi-cuisine spreads with vegetarian, non-vegetarian, and Jain counters."

        return "Thank you for asking! For immediate on-site assistance, please reach out to our Wedding Hospitality Desk at **+91 98765 43210** or ask any coordinator on venue grounds."

concierge_service = ConciergeService()
