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


def build_resume_text(data):
    parts = []

    # 🔹 Education
    for edu in data.get("education", []):
        parts.append(
            f"Education: Studied {edu.get('degree','')} in {edu.get('field_of_study','')} "
            f"at {edu.get('institution','')}, graduating in {edu.get('graduation_year','')}."
        )

    # 🔹 Skills (structured)
    skills = data.get("skills", [])
    for cat in skills:
        name = cat.get("name", "")
        items = cat.get("items", [])
        if items:
            parts.append(f"{name}: {', '.join(items)}.")

    # 🔹 Experience
    for exp in data.get("experience", []):
        parts.append(
            f"Experience: {exp.get('role','')} at {exp.get('organization','')} ({exp.get('duration','')})."
        )

        for resp in exp.get("responsibilities", []):
            parts.append(f"Responsibility: {resp}")

        if exp.get("skills_used"):
            parts.append(
                "Technologies: " + ", ".join(exp.get("skills_used")) + "."
            )

    # 🔹 Projects
    for proj in data.get("projects", []):
        parts.append(
            f"Project: {proj.get('name','')} - {proj.get('description','')}."
        )

        if proj.get("skills_used"):
            parts.append(
                "Technologies: " + ", ".join(proj.get("skills_used")) + "."
            )

    return "\n".join(parts)