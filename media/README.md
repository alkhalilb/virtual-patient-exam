# Media Files Directory

This directory contains audio, images, and videos for examination findings.

## 📁 Directory Structure

```
media/
├── audio/           # Heart sounds, lung sounds, bowel sounds
├── images/          # Clinical photos, diagrams
├── videos/          # Examination demonstrations, patient findings
└── README.md        # This file
```

## 🚀 Quick Start - Download Media

### Required Audio Files

Download these and place them in `media/audio/`:

1. **s3-gallop.mp3** - S3 heart sound
   - Source: https://www.easyauscultation.com/heart-sounds
   - Search for "S3 gallop" or "third heart sound"

2. **mitral-regurg-functional.mp3** - Mitral regurgitation murmur
   - Source: https://www.easyauscultation.com/heart-murmurs
   - Search for "mitral regurgitation"

3. **crackles-bilateral.mp3** - Inspiratory crackles/rales
   - Source: https://www.easyauscultation.com/lung-sounds
   - Search for "fine crackles" or "rales"

4. **crackles-coarse.mp3** - Coarse crackles
   - Source: https://www.easyauscultation.com/lung-sounds
   - Search for "coarse crackles"

5. **wheezes-expiratory.mp3** - Expiratory wheezes
   - Source: https://www.easyauscultation.com/lung-sounds
   - Search for "expiratory wheeze"

### Required Image Files

Download these and place them in `media/images/`:

1. **pitting-edema-bilateral.jpg** - Bilateral leg edema
   - Source: Wikimedia Commons
   - Search: "pitting edema"
   - URL: https://commons.wikimedia.org/wiki/Category:Edema

2. **jvd-elevated.jpg** - Jugular venous distention
   - Source: Medical textbook or Wikimedia Commons
   - Search: "jugular venous distention" or "JVD"

3. **barrel-chest.jpg** - Barrel chest deformity
   - Source: Wikimedia Commons
   - Search: "barrel chest COPD"

## 🔗 Recommended Sources

### Best Free Resources
1. **Easy Auscultation**: https://www.easyauscultation.com/
   - Most comprehensive, free audio library
   - Heart sounds, lung sounds, bowel sounds
   - Easy download

2. **3M Littmann**: https://www.3m.com/3M/en_US/littmann-stethoscopes-us/education/
   - Professional quality recordings
   - Free for educational use

3. **Wikimedia Commons**: https://commons.wikimedia.org/
   - Free images with various licenses
   - Search for specific clinical findings

## 📝 File Naming Convention

Use the exact filenames referenced in the seed data:

### Audio Files (in `audio/`)
- `s3-gallop.mp3`
- `mitral-regurg-functional.mp3`
- `crackles-bilateral.mp3`
- `crackles-coarse.mp3`
- `wheezes-expiratory.mp3`

### Image Files (in `images/`)
- `pitting-edema-bilateral.jpg`
- `jvd-elevated.jpg`
- `barrel-chest.jpg`
- `pursed-lip-breathing.jpg`

## ✅ Testing Media

After adding files:

1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Test media access in browser:
   ```
   http://localhost:3001/media/audio/s3-gallop.mp3
   http://localhost:3001/media/images/pitting-edema-bilateral.jpg
   ```

3. Media will automatically appear in the frontend when you perform examinations!

## 🎨 Creating Placeholder Files (Optional)

If you want to test the app before getting real media, you can create simple placeholder files:

### Placeholder Audio (silent MP3)
```bash
# On Mac/Linux with ffmpeg installed:
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -q:a 9 -acodec libmp3lame media/audio/s3-gallop.mp3
```

### Placeholder Images (solid color)
```bash
# On Mac/Linux with ImageMagick installed:
convert -size 400x300 xc:gray media/images/pitting-edema-bilateral.jpg
```

## 📖 Full Resource Guide

See `/docs/MEDIA_RESOURCES.md` for:
- Comprehensive list of free resources
- Licensing information
- Instructions for creating custom media
- Best practices for medical education media

---

**Note**: The application is already configured to serve these files! Just add them to the appropriate directories and they'll work automatically.
