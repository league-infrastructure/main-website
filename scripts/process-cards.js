#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CARDS_ORIG_DIR = path.join(process.cwd(), 'public/images/cards-orig');
const CARDS_DIR = path.join(process.cwd(), 'public/images/cards');
const TARGET_WIDTH = 700;
const TARGET_HEIGHT = 400;
const TARGET_ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 1.75 (7:4)
const BORDER_PADDING = 25;
const CLOSE_THRESHOLD = 0.1; // 10% tolerance for "close" aspect ratios

async function processImage(inputPath, outputPath) {
  console.log(`Processing: ${path.basename(inputPath)}`);
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    const aspectRatio = width / height;
    
    console.log(`  Original size: ${width}x${height} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    
    // Check if aspect ratio is close to target
    const aspectRatioDiff = Math.abs(aspectRatio - TARGET_ASPECT_RATIO);
    const isCloseAspectRatio = aspectRatioDiff / TARGET_ASPECT_RATIO < CLOSE_THRESHOLD;
    
    if (isCloseAspectRatio) {
      // Just scale to target size
      console.log(`  Close aspect ratio - scaling directly to ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
      await sharp(inputPath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'fill' })
        .png()
        .toFile(outputPath);
    } else {
      // Need to add transparent background and center
      console.log(`  Different aspect ratio - adding transparent background`);
      
      // First, scale the image to fit within a smaller area to leave room for padding
      let scaledWidth, scaledHeight;
      const maxWidth = TARGET_WIDTH - (BORDER_PADDING * 2);
      const maxHeight = TARGET_HEIGHT - (BORDER_PADDING * 2);
      
      if (width / height > maxWidth / maxHeight) {
        // Image is wider relative to available space - scale by width
        scaledWidth = maxWidth;
        scaledHeight = Math.round(height * (maxWidth / width));
      } else {
        // Image is taller relative to available space - scale by height
        scaledHeight = maxHeight;
        scaledWidth = Math.round(width * (maxHeight / height));
      }
      
      console.log(`  Scaled size: ${scaledWidth}x${scaledHeight}`);
      
      // Calculate centering position within target dimensions
      const left = Math.round((TARGET_WIDTH - scaledWidth) / 2);
      const top = Math.round((TARGET_HEIGHT - scaledHeight) / 2);
      
      console.log(`  Centering at: ${left}, ${top}`);
      
      // Create transparent background and composite the scaled image
      await sharp({
        create: {
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
      .composite([{
        input: await sharp(inputPath).resize(scaledWidth, scaledHeight).toBuffer(),
        left: left,
        top: top
      }])
      .png()
      .toFile(outputPath);
    }
    
    console.log(`  ✓ Saved to: ${path.basename(outputPath)}`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(inputPath)}:`, error.message);
  }
}

async function main() {
  console.log('Processing card images...');
  console.log(`Target size: ${TARGET_WIDTH}x${TARGET_HEIGHT} (aspect ratio: ${TARGET_ASPECT_RATIO})`);
  console.log('');
  
  // Ensure output directory exists
  if (!fs.existsSync(CARDS_DIR)) {
    fs.mkdirSync(CARDS_DIR, { recursive: true });
  }
  
  // Get all image files from cards-orig
  const files = fs.readdirSync(CARDS_ORIG_DIR)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  
  console.log(`Found ${files.length} images to process:`);
  files.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  // Process each image
  for (const file of files) {
    const inputPath = path.join(CARDS_ORIG_DIR, file);
    const outputPath = path.join(CARDS_DIR, file.replace(/\.(jpg|jpeg)$/i, '.png'));
    await processImage(inputPath, outputPath);
  }
  
  console.log('');
  console.log('✓ All images processed!');
  
  // Verify all output images are correct size
  console.log('');
  console.log('Verifying output sizes...');
  
  const outputFiles = fs.readdirSync(CARDS_DIR)
    .filter(file => /\.png$/i.test(file));
  
  for (const file of outputFiles) {
    const filePath = path.join(CARDS_DIR, file);
    try {
      const metadata = await sharp(filePath).metadata();
      const sizeCheck = metadata.width === TARGET_WIDTH && metadata.height === TARGET_HEIGHT ? '✓' : '✗';
      console.log(`  ${sizeCheck} ${file}: ${metadata.width}x${metadata.height}`);
    } catch (error) {
      console.log(`  ✗ ${file}: Error reading metadata`);
    }
  }
}

main().catch(console.error);