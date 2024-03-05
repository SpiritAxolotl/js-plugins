/*

A JavaScript plugin that adds a div based RPG style dialogue system. Which includes animation, audio, images and function call logic.
Originally made for SpiritAxolotl's birthday.

Version : 1.3.22

By CalmBubbles :)

*/

class dialogueSys {
  constructor (dialogueBox, blockedText, characters, animIn, animInTime, animOut, animOutTime, audioSrc) {
    this.diaBox = dialogueBox;
    this.blockedChars = blockedText ?? [];
    this.peeps = characters ?? [];
    this.animIn = animIn;
    this.animInTime = animInTime;
    this.animOut = animOut;
    this.animOutTime = animOutTime;
    this.audioSrc = audioSrc;
    this.audioVol = 0.75;
    this.textColor = "inherit";
    this.textBg = "none";
    this.textStyle = "normal";
    this.textWeight = "normal";
    
    /*
    let newDBL = document.createElement("div");
    this.diaBox.appendChild(newDBL);
    */
    
    //this.diaBoxLine = this.diaBox.querySelector("div");
    this.diaBox.setAttribute("data-disabled", "true");
    
    this.whenTypingFunc = function() {};
    this.notTypingFunc = function() {};
    
    this.readyForNextCall = true;
  }
  
  SetActive(state, funcAfter) {
    if (!this.readyForNextCall)
      return requestAnimationFrame(() => {
        this.SetActive(state, funcAfter);
      });
    
    this.readyForNextCall = false;
    
    let animInTime = this.animInTime;
    let animOutTime = this.animOutTime;
    
    this.charIndex = 0;
    this.SpecialBox = null;
    
    if (funcAfter === null) funcAfter = function() {};
    
    if (state === true) {
      this.diaBox.style.animation = `${this.animIn} ${animInTime}s`;
      
      setTimeout(() => {
        this.diaBox.setAttribute("data-disabled", "false");
        this.diaBox.style.animation = "none";
        
        this.diaIsActive = true;
        this.readyForNextCall = true;
        
        funcAfter();
      }, animInTime * 1000);
    } else {
      this.diaIsActive = false;
      
      this.diaBox.innerHTML = "";
      
      this.diaBox.style.animation = `${this.animOut} ${animOutTime}s`;
      
      setTimeout(() => {
        this.diaBox.setAttribute("data-disabled", "true");
        this.diaBox.style.animation = "none";
        
        this.readyForNextCall = true;
        
        funcAfter();
      }, animOutTime * 1000);
    }
  }
  
  typeOnBox(text, speed, person, face, funcAfter) {
    if (!this.diaIsActive) return;
    
    if (!this.readyForNextCall) return requestAnimationFrame(() => { this.typeOnBox(text, speed, person, face, funcAfter); });
    
    this.readyForNextCall = false;
    
    if (funcAfter === null) funcAfter = function() {};
    
    let modifiedText = "";
    let validPeep = false;
    let sndSrc;
    let interval;
    let charIndexOld = this.charIndex;
    
    for (let i = 0; i < text.length; i++)
      modifiedText += `
        <span
          id="dialogueSysChar_${i + this.charIndex}"
          style="
            color: ${this.textColor};
            background: ${this.textBg};
            font-style: ${this.textStyle};
            font-weight: ${this.textWeight};
            visibility: hidden;
          "
        >
          ${text[i]}
        </span>`;
    
    for (let i = 0; i < this.peeps.length; i++)
      if (person === this.peeps[i]) validPeep = true;
    
    if (validPeep !== this.SpecialBox) {
      if (validPeep) {
        this.diaBox.setAttribute("who", person);
        this.diaBox.setAttribute("emotion", face);
        
        this.textBox = this.diaBox.querySelector("span");
        
        sndSrc = `${this.audioSrc}/${person}.ogg`;
      } else {
        this.diaBox.innerHTML = `<span>${modifiedText}</span>`;
        
        this.textBox = this.diaBox.querySelector("span");
        
        sndSrc = `${this.audioSrc}/default.ogg`;
      }
      this.SpecialBox = validPeep;
    } else {
      if (validPeep) {
        this.diaBox.setAttribute("who", person);
        this.diaBox.setAttribute("emotion", face);
        this.textBox.innerHTML += modifiedText;
        
        sndSrc = `${this.audioSrc}/${person}.ogg`;
      } else {
        this.textBox.innerHTML += modifiedText;
        
        sndSrc = `${this.audioSrc}/default.ogg`;
      }
    }
    
    this.whenTypingFunc();
    
    interval = setInterval(() => {
      if (!document.hasFocus()) return null;
      
      let textSnd = new Audio(sndSrc);
      textSnd.volume = this.audioVol;
      let shouldPlaySnd = false;
      
      if (this.charIndex < text.length + charIndexOld) {
        let currentChar = document.querySelector(`#dialogueSysChar_${this.charIndex}`);
        
        if (!this.blockedChars.includes(currentChar.innerHTML))
          shouldPlaySnd = true;
        
        if (shouldPlaySnd) textSnd.play();
        
        currentChar.style.visibility = "visible";
        
        this.charIndex++;
      } else if (this.charIndex === text.length + charIndexOld) {
        clearInterval(interval);
        
        this.notTypingFunc();
        
        this.readyForNextCall = true;
        
        funcAfter();
      }
    }, (24 / speed));
  }
  
  lineBreakBox(amount) {
    if (!this.readyForNextCall) return requestAnimationFrame(() => { this.lineBreakBox(amount); });
    
    this.readyForNextCall = false;
    
    for (let i = 0; i < amount; i++)
      this.textBox.innerHTML += "<br>";
    
    this.readyForNextCall = true;
  }
  
  resetBoxTo(text) {
    if (!this.readyForNextCall) return requestAnimationFrame(() => { this.resetBoxTo(text); });
    
    this.readyForNextCall = false;
    
    let modifiedText = "";
    
    for (const letter of text)
      modifiedText += `
        <span
          id="dialogueSysChar_${this.charIndex + i}"
          style="
            color: ${this.textColor};
            background: ${this.textBg};
            font-style: ${this.textStyle};
            font-weight: ${this.textWeight};
          "
        >
          ${letter}
        </span>`;
    
    this.charIndex = text.length;
    
    this.textBox.innerHTML = modifiedText;
    
    this.readyForNextCall = true;
  }
  
  clearBox() {
    if (!this.readyForNextCall) return requestAnimationFrame(() => { this.clearBox(); });
    
    this.readyForNextCall = false;
    
    this.SpecialBox = null;
    this.charIndex = 0;
    this.diaBox.innerHTML = "";
    
    this.readyForNextCall = true;
  }
}