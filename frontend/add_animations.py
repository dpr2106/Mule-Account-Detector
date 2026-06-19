import os

file_path = "src/app/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    # Audio button
    "transition-colors ${soundEnabled": "transition-all duration-200 hover:scale-105 active:scale-95 ${soundEnabled",
    # Logout button
    "rounded-lg transition-colors text-sm font-medium": "rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium",
    # Tabs
    "rounded-t-lg font-medium transition-colors ${activeTab": "rounded-t-lg font-medium transition-all duration-200 hover:-translate-y-1 ${activeTab",
    # Upload/Export CSV
    "cursor-pointer transition-colors": "cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95",
    "border border-zinc-700 transition-colors": "border border-zinc-700 transition-all duration-200 hover:scale-105 active:scale-95",
    # Live feed items
    "cursor-pointer transition-all duration-200 border": "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border",
    # Bottom 4 buttons
    "rounded font-medium transition-colors cursor-pointer": "rounded font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer",
    "rounded font-medium transition-colors flex items-center gap-2 cursor-pointer": "rounded font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer",
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx buttons")

login_path = "src/app/login/page.tsx"
with open(login_path, "r", encoding="utf-8") as f:
    login_content = f.read()

login_content = login_content.replace(
    "shadow-cyan-500/20 transition-all active:scale-[0.98]",
    "shadow-cyan-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
)
login_content = login_content.replace(
    "hover:text-cyan-300 transition-colors",
    "hover:text-cyan-300 transition-all duration-200 hover:scale-105"
)

with open(login_path, "w", encoding="utf-8") as f:
    f.write(login_content)

print("Updated login/page.tsx buttons")
