import os
import re
from typing import Dict, Any

def parse_obsidian_note(filepath: str) -> Dict[str, Any]:
    """
    Parses an Obsidian note, extracting frontmatter (if any) and content.
    For simplicity, we handle basic YAML frontmatter.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    metadata = {
        "source": os.path.basename(filepath),
        "source_path": os.path.abspath(filepath),
    }
    
    # Simple frontmatter extraction
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(1)
        text_content = frontmatter_match.group(2)
        # Parse basic frontmatter key-values
        for line in frontmatter.split('\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                metadata[k.strip()] = v.strip()
    else:
        text_content = content

    return {
        "content": text_content.strip(),
        "metadata": metadata,
        "filename": os.path.basename(filepath)
    }
