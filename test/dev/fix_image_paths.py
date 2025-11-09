#!/usr/bin/env python3
"""
Fix image paths in Astro content collection posts.
Move images from content/posts directories to public/images/posts and update references.
"""

import os
import shutil
import re
from pathlib import Path
import yaml

def find_posts_with_images():
    """Find all markdown files with featuredImage references"""
    posts_dir = Path("src/content/posts")
    posts_with_images = []
    
    print(f"Scanning {posts_dir} for markdown files...")
    md_files = list(posts_dir.rglob("*.md"))
    print(f"Found {len(md_files)} markdown files")
    
    for md_file in md_files:
        print(f"Processing {md_file}")
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract frontmatter
            if content.startswith('---'):
                # Split frontmatter and content
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter_text = parts[1].strip()
                    try:
                        frontmatter = yaml.safe_load(frontmatter_text)
                        print(f"  Frontmatter loaded: {frontmatter.keys() if frontmatter else 'None'}")
                        
                        if frontmatter and 'featuredImage' in frontmatter:
                            featured_img = frontmatter['featuredImage']
                            print(f"  Featured image: {featured_img}")
                            
                            if isinstance(featured_img, dict) and 'src' in featured_img:
                                src = featured_img['src']
                                print(f"  Image src: {src}")
                                
                                if src.startswith('./'):
                                    print(f"  Found relative image path: {src}")
                                    posts_with_images.append({
                                        'file': md_file,
                                        'src': src,
                                        'frontmatter': frontmatter,
                                        'content': content
                                    })
                    except yaml.YAMLError as e:
                        print(f"  YAML error in {md_file}: {e}")
        except Exception as e:
            print(f"Error processing {md_file}: {e}")
    
    print(f"Found {len(posts_with_images)} posts with relative image paths")
    return posts_with_images

def move_images_and_update_paths():
    """Move images to public directory and update paths"""
    posts_with_images = find_posts_with_images()
    
    if not posts_with_images:
        print("No posts with relative image paths found!")
        return
    
    # Create public/images/posts directory
    public_images_dir = Path("public/images/posts")
    public_images_dir.mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {public_images_dir}")
    
    for post_info in posts_with_images:
        md_file = post_info['file']
        old_src = post_info['src']
        content = post_info['content']
        
        print(f"\nProcessing: {md_file}")
        print(f"  Old src: {old_src}")
        
        # Get the image file path
        image_file = md_file.parent / old_src.replace('./', '')
        print(f"  Looking for image: {image_file}")
        
        if image_file.exists():
            # Create a unique name based on the post path
            relative_path = md_file.relative_to(Path("src/content/posts"))
            post_dir_parts = relative_path.parent.parts
            image_name = image_file.name
            
            # Create new filename: year-month-day-original-name
            new_image_name = f"{'-'.join(post_dir_parts)}-{image_name}"
            new_image_path = public_images_dir / new_image_name
            
            # Copy image to public directory
            print(f"  Copying {image_file} -> {new_image_path}")
            shutil.copy2(image_file, new_image_path)
            
            # Update the markdown file
            new_src = f"/images/posts/{new_image_name}"
            updated_content = content.replace(f"src: {old_src}", f"src: {new_src}")
            
            print(f"  Updating {md_file}: {old_src} -> {new_src}")
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
        else:
            print(f"  Warning: Image file not found: {image_file}")

if __name__ == "__main__":
    os.chdir("/Volumes/Proj/proj/league-projects/website")
    move_images_and_update_paths()
    print("Done!")