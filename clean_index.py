
import re

file_path = 'index.html'

with open(file_path, 'r') as f:
    content = f.read()

# Pattern to remove BrandGuardian object definition
bg_pattern = r'const BrandGuardian = \{[\s\S]*?\}\s*;\s*'
content = re.sub(bg_pattern, '', content)

# Pattern to remove KNOWLEDGE_BASE array definition
kb_pattern = r'const KNOWLEDGE_BASE = \[[\s\S]*?\]\s*;\s*'
content = re.sub(kb_pattern, '', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Removed hardcoded BrandGuardian and KNOWLEDGE_BASE from index.html")
