# AI Image Generation Prompts for Virtual Patient Simulator

This guide contains detailed prompts for generating medical examination images using AI tools like Flux AI, Midjourney, DALL-E, or Stable Diffusion.

## 🫀 Heart Failure (CHF) Case Images

### 1. Pitting Edema (Bilateral Lower Extremities)
**Filename needed:** `pitting-edema-bilateral.jpg`

**FLUX AI PROMPT:**
```
Medical photograph of bilateral lower extremity pitting edema, clinical photography style, both legs from knees down showing significant swelling extending to mid-calf, visible indentation marks from finger pressure test, skin appears taut and shiny, symmetric swelling on both legs, neutral medical background, professional medical documentation quality, well-lit clinical setting, anatomically accurate, photorealistic, 4K medical imaging
```

**Alternative Shorter Prompt:**
```
Clinical photo: bilateral leg edema with pitting, swollen calves and ankles, finger pressure indentations visible, medical documentation style, photorealistic
```

**Key Features to Include:**
- Both legs visible from knees down
- Obvious swelling/puffiness in lower legs and ankles
- Skin appears stretched and shiny
- Indentations from pressure (pitting)
- Symmetric appearance

---

### 2. Jugular Venous Distention (JVD)
**Filename needed:** `jvd-elevated.jpg`

**FLUX AI PROMPT:**
```
Medical photograph of jugular venous distention (JVD), patient at 45-degree angle, visible prominent jugular vein in neck, distended internal jugular vein clearly visible, clinical photography style, male patient neck in profile showing elevated jugular venous pressure, medical examination setting, professional documentation quality, photorealistic, well-lit, anatomically accurate, 4K medical imaging
```

**Alternative Shorter Prompt:**
```
Clinical photo: neck showing jugular vein distention (JVD), patient reclined at 45 degrees, prominent neck veins visible, medical documentation style, side view, photorealistic
```

**Key Features to Include:**
- Patient positioned at 45-degree angle
- Neck in profile or slight angle
- Visible bulging jugular vein
- Clear anatomical landmarks
- Professional medical documentation style

**Note:** This is one of the harder images to generate well with AI. Consider using a real photo from Wikimedia Commons as backup.

---

### 3. Displaced Apex Beat / Cardiomegaly (Optional)
**Filename:** `apex-displaced.jpg` (not currently in seed data, but useful)

**FLUX AI PROMPT:**
```
Medical illustration showing cardiac examination, hand palpating displaced point of maximal impulse (PMI), chest wall with anatomical landmarks visible, apex beat located in 6th intercostal space anterior axillary line indicating cardiomegaly, medical textbook illustration style, anatomically accurate, clear educational diagram
```

---

## 🫁 COPD Case Images

### 4. Barrel Chest Deformity
**Filename needed:** `barrel-chest.jpg`

**FLUX AI PROMPT:**
```
Medical photograph of barrel chest deformity in COPD patient, lateral view showing increased anteroposterior diameter, chest appears rounded and barrel-shaped, ribs oriented more horizontally than normal, elderly male patient, clinical photography style, neutral medical background, professional documentation quality, photorealistic, well-lit, anatomically accurate, 4K medical imaging
```

**Alternative Shorter Prompt:**
```
Clinical photo: barrel chest from side view, COPD patient, increased chest diameter, rounded appearance, ribs horizontal, elderly male, medical documentation style, photorealistic
```

**Key Features to Include:**
- Side/lateral view of chest
- Chest appears rounded like a barrel
- Increased front-to-back diameter
- Ribs more horizontal than normal
- Can include breathing posture (pursed lips if visible)

---

### 5. Pursed-Lip Breathing
**Filename needed:** `pursed-lip-breathing.jpg`

**FLUX AI PROMPT:**
```
Medical photograph of elderly patient demonstrating pursed-lip breathing technique, close-up of face showing lips pursed during exhalation, patient appears to be working to breathe, COPD respiratory pattern, clinical photography style, professional medical documentation, photorealistic, well-lit, anatomically accurate, 4K medical imaging
```

**Alternative Shorter Prompt:**
```
Clinical photo: COPD patient face showing pursed-lip breathing, lips pursed during exhale, elderly person, medical documentation style, photorealistic
```

**Key Features to Include:**
- Close-up or mid-shot of patient face
- Lips pursed (like blowing out a candle)
- May show slight respiratory effort
- Elderly patient preferred (typical COPD demographic)

---

## 🦠 Pneumonia Case Images

### 6. Patient with Respiratory Distress (Optional)
**Filename:** `respiratory-distress.jpg`

**FLUX AI PROMPT:**
```
Medical photograph of patient with pneumonia showing mild respiratory distress, patient sitting upright in hospital bed, slightly increased work of breathing, clinical photography style, professional medical documentation, photorealistic, well-lit, anatomically accurate, 4K medical imaging
```

---

## 💡 General Tips for AI Image Generation

### For Best Results with Flux AI:

1. **Use Medical Photography Keywords:**
   - "clinical photography style"
   - "medical documentation quality"
   - "professional medical imaging"
   - "anatomically accurate"
   - "photorealistic"
   - "4K medical imaging"

2. **Specify Lighting:**
   - "well-lit clinical setting"
   - "professional medical lighting"
   - "clear visibility of details"

3. **Specify Background:**
   - "neutral medical background"
   - "hospital examination room"
   - "clinical setting"

4. **Avoid These Terms:**
   - Anything suggesting emergency/trauma
   - Gore or disturbing content
   - Patient identifying information

### Image Specifications:

- **Format:** JPG or PNG
- **Resolution:** At least 1024x1024 (higher is better)
- **Aspect Ratio:** 4:3 or 16:9 for most clinical photos
- **File Size:** Under 5MB for web performance

### After Generating:

1. Review image for medical accuracy
2. Ensure it clearly shows the pathology
3. Crop/resize as needed
4. Rename to exact filename needed
5. Place in `/media/images/`

---

## 🎨 Alternative: Use Stable Diffusion with ControlNet

If you have access to Stable Diffusion with medical model fine-tuning:

**Recommended Models:**
- Realistic Vision (for photorealistic medical images)
- ChilloutMix (good for clinical photography style)

**ControlNet Settings:**
- Use reference images from Wikimedia Commons
- Depth control for better anatomy
- Canny edge for precise medical features

---

## 📋 Image Generation Checklist

### Heart Failure (CHF)
- [ ] pitting-edema-bilateral.jpg
- [ ] jvd-elevated.jpg (backup: use real photo if AI struggles)

### COPD
- [ ] barrel-chest.jpg
- [ ] pursed-lip-breathing.jpg

### Testing
- [ ] Images are clear and medically accurate
- [ ] Files renamed to exact names
- [ ] Placed in /media/images/
- [ ] Tested in app (http://localhost:3001/media/images/filename.jpg)

---

## ⚠️ Important Notes

**Medical Accuracy:**
- AI-generated images should be used for educational simulation only
- They may not capture all clinical nuances
- Consider having medical faculty review generated images
- Real patient photos (with consent) are always better for teaching

**Ethical Considerations:**
- These are simulated patients, not real individuals
- Use for educational purposes only
- Ensure images are respectful and professional
- Avoid generating anything that could be misconstrued

**Legal:**
- AI-generated images are typically free to use
- Check Flux AI's terms of service
- No patient consent needed (these aren't real patients)
- Suitable for educational use

---

## 🚀 Quick Start with Flux AI

1. Go to Flux AI website/tool
2. Copy the prompt for the first image (pitting-edema-bilateral.jpg)
3. Generate image
4. Review for medical accuracy
5. Download and rename to exact filename
6. Place in `/media/images/`
7. Repeat for other images
8. Test in your app!

**Estimated time:** 10-15 minutes to generate all images

---

## 📸 What to Do If AI Generation Doesn't Work Well

Some medical findings are hard for AI to generate accurately (especially JVD). In that case:

1. **Use Wikimedia Commons** for real photos (free, CC-licensed)
2. **Medical textbook screenshots** (if you have access/permission)
3. **Simulation lab photos** (with permission)
4. **Combination approach:** Use AI for some, real photos for others

The app will work with a mix of AI-generated and real photos!

---

Good luck generating your medical images! 🏥
