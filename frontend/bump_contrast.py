import os

directory = "src/app"

replacements = {
    # Push backgrounds to pure black
    "bg-zinc-950": "bg-black",
    "bg-zinc-900/80": "bg-black/90",
    "bg-zinc-900/50": "bg-black/80",
    "bg-zinc-900": "bg-zinc-950", # push 900 down to 950
    
    # Push text brighter
    "text-zinc-400": "text-zinc-300",
    "text-zinc-300": "text-zinc-200",
    "text-zinc-500": "text-zinc-400",
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
