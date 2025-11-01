#!/usr/bin/env python3

import os
import re
from pathlib import Path

# Mapping of old date-based paths to correct paths
path_mappings = {
    # Files that exist in main images directory
    '/images/2021/05/Copy-of-MX-Library-Workshop_1.png': '/images/Copy-of-MX-Library-Workshop_1.png',
    '/images/2021/05/Copy-of-Forcepoint-Cybersecurity-Comp_4-e1632432194464.png': '/images/Copy-of-Forcepoint-Cybersecurity-Comp_4-e1632432194464.png',
    '/images/2021/05/girl-scouts-2020-03.png': '/images/girl-scouts-2020-03.png',
    '/images/2021/10/toprated.png': '/images/toprated.png',
    
    # Files that might be missing - we'll need to handle these separately
    '/images/2021/09/Seal-2023-transp-1400px.png': '/images/Seal-2023-transp-1400px.png',
    '/images/2022/01/logo2-800x658.png': '/images/logo2-800x658.png',
}

def update_file_paths(file_path):
    """Update image paths in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all the old paths with new paths
        for old_path, new_path in path_mappings.items():
            content = content.replace(old_path, new_path)
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
            return True
        
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    # Find all files to update
    src_dir = Path('src')
    files_to_check = []
    
    # Get all TypeScript, Astro, and Markdown files
    for pattern in ['**/*.ts', '**/*.astro', '**/*.md']:
        files_to_check.extend(src_dir.glob(pattern))
    
    updated_count = 0
    
    for file_path in files_to_check:
        if update_file_paths(file_path):
            updated_count += 1
    
    print(f"\nUpdated {updated_count} files with corrected paths")

if __name__ == '__main__':
    main()