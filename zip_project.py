import os
import zipfile

def zip_project(output_filename="ai_cashflow_pro.zip"):
    # Folders and files to exclude from the zip archive
    exclude_dirs = {
        "node_modules",
        "dist",
        ".git",
        "__pycache__",
        ".vscode",
        ".env"
    }
    
    exclude_files = {
        output_filename,
        "package-lock.json",
        ".DS_Store"
    }

    print(f"⚡ Starting package zip for AI CashFlow Pro...")
    print(f"📦 Output target: {output_filename}")
    print("-" * 50)

    try:
        with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk("."):
                # Filter out excluded directories in-place to prevent os.walk from entering them
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                
                for file in files:
                    if file in exclude_files:
                        continue
                        
                    # Calculate local file path relative to root
                    file_path = os.path.join(root, file)
                    # Archive path relative to current working directory
                    arcname = os.path.relpath(file_path, ".")
                    
                    print(f"   ➕ Adding: {arcname}")
                    zipf.write(file_path, arcname)
                    
        print("-" * 50)
        print(f"🎉 Success! Project zipped perfectly into: {output_filename}")
        print(f"💡 You can now transfer this ZIP file and extract it in VS Code.")
        print(f"🚀 To run the app locally, run: npm install && npm run dev")
    except Exception as e:
        print(f"❌ An error occurred during the zipping process: {e}")

if __name__ == "__main__":
    zip_project()
