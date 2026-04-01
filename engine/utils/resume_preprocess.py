import re

def preprocess_resume_text(raw_text: str) -> str:
    text = re.sub(r'\r', '\n', raw_text)
    text = re.sub(r'\t', ' ', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n+', '\n', text)

    text = re.sub(r'[•●▪◦*]', '-', text)

    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\+?\d[\d -]{8,}\d', '', text)
    text = re.sub(r'Page \d+ of \d+', '', text, flags=re.IGNORECASE)

    return text.strip()