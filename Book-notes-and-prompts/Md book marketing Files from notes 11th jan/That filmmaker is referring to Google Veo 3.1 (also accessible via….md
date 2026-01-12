#   
  
That filmmaker is referring to **Google Veo 3.1** (also accessible via a tool called **Google Flow** or **VideoFX** in Google Labs). This is not just a standard chatbot; it is Google's dedicated, professional-grade AI video studio.  
The reason his video looks "cinema grade" and features his own face is that he is using a specific feature set called **"Ingredients to Video"** or **"Actor Reference."**  
Here is exactly how he did it, and how you can replicate that "Edenwood" vibe:  
## 1. The Tool: Google Flow (VideoFX)  
He is likely not doing this in a standard chat window (like standard Gemini). He is using the **VideoFX / Google Flow** interface.  
* **What it is:** A specialized dashboard for filmmakers where you have more control than just a chat box.  
* **The "Credit" Issue:** You mentioned your credits run out. This is because high-definition rendering (1080p/4K) in Veo 3.1 is extremely expensive computationally. He likely has a **Google One AI Premium** subscription or access to **Vertex AI** (the developer platform) which gives higher quotas.  
## 2. The Technique: "The Identity Lock"  
To get his *own* features on the character, he didn't just ask for "a man who looks like me." He used **Reference Inputs**.  
* **Step 1: The Character Reference (The "Face"):** He uploaded a high-resolution, well-lit photo of himself. In Veo 3.1, you can tag this image as the "Character" ingredient.  
* **Step 2: The Style Reference (The "Vibe"):** To get that "Edenwood" aesthetic (cinematic, moody, sci-fi), he likely uploaded a *separate* image (concept art or a film still) and tagged it as the "Style" ingredient.  
* **Step 3: The Prompt:** He then combined them: *"A cinematic shot of [Character] standing in a [Style] environment, delivering a monologue to the camera, 35mm film grain, anamorphic lens."*  
## 3. How he made it "Speak to the Camera"  
Standard AI video often struggles with lip-syncing. He likely used one of two methods:  
* **Method A (Native Veo Audio):** Veo 3.1 has a new "Dialogue Generation" feature. You type the script, and it generates the video *and* the audio with lip-sync in one go.  
* **Method B (The "Stack" - Higher Quality):**  
    1. **Generate the Video:** Create the video of the character moving/looking at the camera using Veo (without talking).  
    2. **Generate the Voice:** Use **ElevenLabs** to clone his own voice reading the script.  
    3. **Sync the Lips:** Use a tool like **Hedra**, **LivePortrait**, or **Sync Labs** to drag the audio onto the video, which forces the mouth to move perfectly.  
## How You Can Do It (Without wasting credits)  
1. **Get the Right App:** Search for **"Google VideoFX"** or sign up for **Google Labs**. This is where the powerful version of Veo lives.  
2. **Prepare Your Assets:**  
    * Take a **"Passport Style" Photo** of yourself (neutral lighting, looking at camera). This uses fewer "credits" because the AI doesn't have to guess your face.  
    * Find a **"Vibe Image"** (e.g., a dark, green-tinted sci-fi corridor).  
3. **Use the "Ingredients" Mode:** Upload your face (Character) + Vibe Image (Style).  
4. **Prompt for "Performance":** Use keywords like: *"Slow zoom in, breaking the fourth wall, intense eye contact, high fidelity texture."*  
**Verdict:** He didn't just "chat" with it. He acted as a **Director** using the "Ingredients" dashboard in Google Flow. If you want to replicate it, stop using text-only prompts and start using **Image-to-Video** with a photo of yourself.  
