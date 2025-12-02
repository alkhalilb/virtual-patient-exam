# Media Resources Guide

This document lists free and open-source resources for obtaining medical examination media (audio, images, videos).

## 🎵 Heart & Lung Sounds (Audio)

### Free Resources

1. **3M Littmann Sound Library** (Free for educational use)
   - https://www.3m.com/3M/en_US/littmann-stethoscopes-us/education/
   - High-quality recordings of heart murmurs, lung sounds
   - Download as MP3/WAV files

2. **University of Washington Heart Sounds**
   - https://depts.washington.edu/physdx/heart/demo.html
   - S1, S2, S3, S4, various murmurs
   - Free educational resource

3. **Easy Auscultation**
   - https://www.easyauscultation.com/
   - Comprehensive library of:
     - Heart sounds (normal, S3/S4 gallops, murmurs)
     - Lung sounds (crackles, wheezes, rhonchi, pleural rub)
     - Bowel sounds
   - Free access to audio files

4. **Practicalclinicalskills.com**
   - https://www.practicalclinicalskills.com/
   - Free heart and lung sounds
   - Clear categorization

5. **Medzcool on YouTube**
   - https://www.youtube.com/@medzcool
   - Heart sounds, lung sounds
   - Can download audio using YouTube downloaders

### Sounds Needed for Current Cases

#### CHF Case
- ✅ S3 gallop (heard at apex)
- ✅ Functional mitral regurgitation
- ✅ Bilateral inspiratory crackles (rales)

#### COPD Case
- ✅ Diffuse expiratory wheezes
- ✅ Decreased breath sounds

#### Pneumonia Case
- ✅ Coarse crackles (right lower lobe)
- ✅ Bronchial breath sounds

## 📸 Clinical Images

### Free Resources

1. **DermNet NZ** (Dermatology images)
   - https://dermnetnz.org/
   - Creative Commons licensed
   - Excellent for skin findings

2. **Wikimedia Commons - Medical Images**
   - https://commons.wikimedia.org/wiki/Category:Medical_images
   - Public domain and CC-licensed images
   - Wide variety of clinical findings

3. **OpenStax Anatomy & Physiology**
   - https://openstax.org/books/anatomy-and-physiology
   - Free, CC-licensed anatomical images
   - Good for educational use

4. **NIH National Library of Medicine - MedlinePlus**
   - https://medlineplus.gov/
   - Public domain images
   - Patient education quality

5. **Radiopaedia** (for reference)
   - https://radiopaedia.org/
   - Creative Commons licensed
   - Excellent radiology images (if you want to add X-rays later)

### Images Needed for Current Cases

#### CHF Case
- ✅ Bilateral pitting edema (lower extremities)
- ✅ Jugular venous distention (JVD)

#### COPD Case
- ✅ Barrel chest deformity
- ✅ Pursed-lip breathing

#### Pneumonia Case
- (Most findings are auscultatory, minimal images needed)

## 🎬 Clinical Videos

### Free Resources

1. **Stanford Medicine 25**
   - https://stanfordmedicine25.stanford.edu/
   - Excellent physical exam demonstration videos
   - Free for educational use

2. **New England Journal of Medicine - Videos in Clinical Medicine**
   - https://www.nejm.org/multimedia/videos-in-clinical-medicine
   - High-quality technique demonstrations
   - Some free access

3. **YouTube Educational Channels**
   - **Osmosis** - https://www.youtube.com/@osmosis
   - **Medzcool** - https://www.youtube.com/@medzcool
   - **Strong Medicine** - https://www.youtube.com/@StrongMed
   - Download using youtube-dl or similar tools

### Videos Potentially Useful
- Respiratory patterns (Cheyne-Stokes, Kussmaul, etc.)
- Gait abnormalities
- Cranial nerve examinations
- Special maneuvers (Murphy's sign, etc.)

## 📁 How to Add Media to This Project

### 1. Download Media Files

Download appropriate files from the resources above.

### 2. Organize in Media Directory

```bash
media/
├── audio/
│   ├── heart/
│   │   ├── s3-gallop.mp3
│   │   ├── mitral-regurg-functional.mp3
│   │   └── normal-heart-sounds.mp3
│   └── lungs/
│       ├── crackles-bilateral.mp3
│       ├── crackles-coarse.mp3
│       ├── wheezes-expiratory.mp3
│       └── normal-breath-sounds.mp3
├── images/
│   ├── pitting-edema-bilateral.jpg
│   ├── jvd-elevated.jpg
│   ├── barrel-chest.jpg
│   └── pursed-lip-breathing.jpg
└── videos/
    └── (future videos)
```

### 3. Update Seed Data

The seed file (`backend/prisma/seed.ts`) already has `mediaUrl` fields pointing to these paths:
- `/media/audio/s3-gallop.mp3`
- `/media/images/pitting-edema-bilateral.jpg`
- etc.

Once you add the files, they'll automatically be referenced!

### 4. Serve Media Files from Backend

The Express server will need to serve static files. This is already planned but needs to be uncommented when you have media:

```typescript
// In backend/src/server.ts, add:
import path from 'path';

app.use('/media', express.static(path.join(__dirname, '../../media')));
```

## 🎨 Creating Your Own Simple Media (If Needed)

### For Images
- Use a smartphone camera
- Take photos of:
  - Medical textbook diagrams (if allowed by license)
  - Your own demonstrations (with appropriate consent)
- Edit with free tools:
  - GIMP (https://www.gimp.org/)
  - Photopea (https://www.photopea.com/)

### For Audio
- Record from medical simulation equipment
- Use simulation lab resources
- Contact your institution's simulation center
- Some medical schools have existing libraries you can access

### For Videos
- Screen record from educational websites (with permission)
- Film simulation mannequins
- Use institutional simulation center recordings

## ⚖️ Licensing Considerations

**Always check licensing before using media in an educational product:**

1. **For Internal Educational Use**: Most resources are fine
2. **For Public Distribution**: Ensure you have proper licenses
3. **Creative Commons**: Check if attribution is required
4. **Fair Use**: Educational use often qualifies, but verify

## 📝 Quick Start Checklist

- [ ] Download 6-8 heart sounds from Easy Auscultation or 3M Littmann
- [ ] Download 4-6 lung sounds (crackles, wheezes) from same sources
- [ ] Find 2-3 clinical images from Wikimedia Commons (edema, JVD, barrel chest)
- [ ] Organize files in `/media` directory as shown above
- [ ] Update Express server to serve static files
- [ ] Test media playback in the application

---

## 🚀 Future Enhancements

- Add audio waveform visualization
- Implement video player with controls
- Add image zoom/pan functionality
- Create audio looping for practice
- Add playback speed control for sounds

---

**Note**: The application is already built to handle media! Just add the files to the `/media` directory and everything will work automatically.
