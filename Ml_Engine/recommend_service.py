from datetime import datetime, date
import re

def make_case_insensitive_regex(value):
    """
    Return regex pattern for flexible match: allows optional hyphen/space/underscore differences.
    Works safely for MongoDB.
    """
    if not isinstance(value, str):
        value = str(value)
    v = value.strip().lower()
    # Replace spaces, hyphens, underscores with optional pattern
    # Use double backslash \\ for MongoDB to interpret \s literally
    v = re.sub(r'[\s\-_]+', '[\\s\\-_]?', v)
    return {"$regex": f"^{v}$", "$options": "i"}




def build_or_regex_for_values(values):
    """Return an array of regex match conditions for MongoDB $or query."""
    ors = []
    for v in values:
        if not v:
            continue
        try:
            ors.append(make_case_insensitive_regex(v))
        except Exception as e:
            print(f"Skipping value {v} due to error: {e}")
    return ors


def parse_stipend_to_number(stipend_str):
    """Parse stipend string like '₹8,000', '$1100', '30k' -> numeric value (int)."""
    if stipend_str is None:
        return None
    s = str(stipend_str).replace(',', '').strip()
    
    # Handle K shorthand
    m = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*[kK]\b', s)
    if m:
        try:
            return int(float(m.group(1)) * 1000)
        except:
            return None

    # Regular numbers
    m2 = re.search(r'([0-9]+(?:\.[0-9]+)?)', s)
    if m2:
        try:
            return int(float(m2.group(1)))
        except:
            return None
    return None


def parse_filter_stipend_range(filter_str):
    """
    Parse filter string like '2k-5k', '₹5K-10K', '5000' into (min, max) tuple.
    Returns None if parsing fails.
    """
    if not filter_str or not isinstance(filter_str, str):
        return None
    s = filter_str.lower().replace(',', '').strip()
    s = re.sub(r'[₹\$£€]', '', s)
    s = s.replace('k', '000')

    if '-' in s:
        parts = s.split('-')
        try:
            mn = int(float(parts[0]))
            mx = int(float(parts[1]))
            if mn > mx:
                mn, mx = mx, mn
            return (mn, mx)
        except:
            return None

    m = re.search(r'([0-9]+)', s)
    if m:
        v = int(m.group(1))
        return (v, v)
    return None


def last_date_is_open(doc_last_date_str):
    """
    Return True if lastDate is >= today.
    Supports multiple date formats.
    """
    if not doc_last_date_str:
        return False
    s = str(doc_last_date_str).strip()
    formats = [
        "%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d",
        "%d-%b-%Y", "%d %b %Y", "%Y.%m.%d"
    ]
    for fmt in formats:
        try:
            d = datetime.strptime(s, fmt).date()
            return d >= date.today()
        except:
            continue
    # Fallback: try extracting numbers manually
    m = re.search(r'([0-9]{4})[^\d]?([0-9]{1,2})[^\d]?([0-9]{1,2})', s)
    if m:
        try:
            y, mth, dday = int(m.group(1)), int(m.group(2)), int(m.group(3))
            d = date(y, mth, dday)
            return d >= date.today()
        except:
            return False
    return False
