from datetime import datetime, date
import re

def build_or_regex_for_values(values):
    if not values:
        return []
    return [re.compile(f"^{re.escape(v)}$", re.IGNORECASE) for v in values]

def parse_stipend_to_number(stipend_str):
    if not stipend_str or stipend_str.lower() == "unpaid":
        return 0
    try:
        stipend_str = stipend_str.replace("₹", "").replace("K", "000").replace("+", "")
        if "-" in stipend_str:
            parts = stipend_str.split("-")
            return int(parts[0].strip())
        return int(stipend_str.strip())
    except Exception:
        return None

def parse_filter_stipend_range(stipend_filter):
    if stipend_filter.lower() == "unpaid":
        return (0, 0)
    try:
        s = stipend_filter.replace("₹", "").replace("K", "000").replace("+", "")
        if "-" in s:
            mn, mx = s.split("-")
            return (int(mn.strip()), int(mx.strip()))
        return (int(s.strip()), 10**9)
    except Exception:
        return None

def last_date_is_open(last_date_str):
    try:
        last_date = datetime.strptime(last_date_str, "%d-%m-%Y")
        return last_date >= datetime.today()
    except Exception:
        return False