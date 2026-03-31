import re

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;:!?()\- ]", "", text)
    return text.strip()

def build_combined_text(data: dict) -> str:
    parts = []

    if data.get("jobTitle"):
        parts.append(("Internship Title: " + clean_text(data["jobTitle"]) + ". ") * 2)
    if data.get("jobRole"):
        parts.append(f"Role: {clean_text(data['jobRole'])}.")
    if data.get("jobTopic"):
        parts.append(("Topic: " + clean_text(data["jobTopic"]) + ". ") * 3)
    if data.get("description"):
        parts.append(("Responsibilities include: " + clean_text(data["description"]) + ". ") * 3)

    return " ".join(parts)