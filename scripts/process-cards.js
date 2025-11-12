#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CARDS_ORIG_DIR = path.join(process.cwd(), 'public/images/cards-orig');
const CARDS_DIR = path.join(process.cwd(), 'public/images/cards');
const TARGET_WIDTH = 700;
const TARGET_HEIGHT = 400;
const TARGET_ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 1.75 (7:4)

async function processImage(inputPath, outputPath) {
  console.log(`Processing: ${path.basename(inputPath)}`);
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    const aspectRatio = width / height;
    
    console.log(`  Original size: ${width}x${height} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    
    // Resize to fill the entire frame by cropping, avoiding transparent borders.
    console.log(`  Resizing with cover fit to ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: sharp.fit.cover,
        position: sharp.strategy.attention
      })
      .png()
      .toFile(outputPath);
    
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