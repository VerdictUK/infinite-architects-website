
import os

file_path = 'index.html'
script_file = 'chat_script_block.html'

with open(file_path, 'r') as f:
    content = f.read()

with open(script_file, 'r') as f:
    new_script = f.read()

# Start marker - use the exact comment
start_marker = '<!-- Ask the Book JavaScript -->'
# End marker - find the </script> tag after the start marker
end_marker_tag = '</script>'

start_idx = content.rfind(start_marker)

if start_idx == -1:
    print(f"Start marker '{start_marker}' not found!")
    exit(1)

# Find the next </script> after start_idx
end_idx = content.find(end_marker_tag, start_idx)

if end_idx == -1:
    print("End marker </script> not found after start marker!")
    exit(1)

# Include the closing </script> in the replacement range to match how new_script is structured
# Wait, my new_script HAS </script> at the end.
# So I should replace up to end_idx + len(end_marker_tag)

replace_end_idx = end_idx + len(end_marker_tag)

new_content = content[:start_idx] + new_script + content[replace_end_idx:]

with open(file_path, 'w') as f:
    f.write(new_content)

print("Ask the Book script injected successfully.")
