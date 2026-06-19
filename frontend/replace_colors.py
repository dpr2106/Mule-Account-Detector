import os
import re

directory = "src/app"

replacements = {
    # Backgrounds
    "slate-900": "zinc-950",
    "slate-800": "zinc-900",
    "slate-700": "zinc-800",
    "slate-600": "zinc-700",
    
    # Text
    "slate-500": "zinc-500",
    "slate-400": "zinc-400",
    "slate-300": "zinc-300",
    "slate-200": "zinc-200",
    
    # Accents
    "indigo-": "cyan-",
    "rose-": "pink-",
    "emerald-": "lime-",
    "yellow-": "amber-",
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
