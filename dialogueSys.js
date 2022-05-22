/*

A JavaScript plugin that adds a div based RPG style dialogue system. Which includes animation, audio, images and function call logic.
Originally made for SpiritAxolotl's birthday.

Version : 1.32a

By CalmBubbles :)

*/

class dialogueSys
{
    constructor (dialogueBox, blockedText, characters, animIn, animInTime, animOut, animOutTime, imgSrc, audioSrc)
    {
        this.diaBox = dialogueBox;
        this.blockedChars = blockedText;
        this.peeps = characters;
        this.animIn = animIn;
        this.animInTime = animInTime;
        this.animOut = animOut;
        this.animOutTime = animOutTime;
        this.imgSrc = imgSrc;
        this.audioSrc = audioSrc;
        this.audioVol = 0.75;
        this.textColor = "white";
        this.textBg = "none";
        
        var newDBL = document.createElement("div");
        this.diaBox.appendChild(newDBL);
        
        this.diaBoxLine = this.diaBox.querySelector("div");
        this.diaBox.setAttribute("data-disabled", "true");
        
        this.whenTypingFunc = function () { };
        this.notTypingFunc = function () { };
    }
    
    SetActive (state, funcAfter)
    {
        var animInTime = this.animInTime;
        var animOutTime = this.animOutTime;
        
        this.charIndex = 0;
        this.SpecialBox = null;
        
        if (funcAfter == null) funcAfter = function () { };
        
        if (state == true)
        {
            this.diaBox.style.animation = `${this.animIn} ${animInTime}s`;
            
            setTimeout(() => {
                this.diaBox.setAttribute("data-disabled", "false");
                this.diaBox.style.animation = "none";
                
                this.diaIsActive = true;
                
                funcAfter();
            }, animInTime * 1000);
        }
        else
        {
            this.diaIsActive = false;
            
            this.diaBoxLine.innerHTML = "";
            
            this.diaBox.style.animation = `${this.animOut} ${animOutTime}s`;
            
            setTimeout(() => {
                this.diaBox.setAttribute("data-disabled", "true");
                this.diaBox.style.animation = "none";
                funcAfter();
            }, animOutTime * 1000);
        }
    }
    
    typeOnBox (text, speed, person, face, funcAfter)
    {
        if (!this.diaIsActive) return;
        
        var modifiedText;
        var validPeep = false;
        var interval;
        var sndSrc;
        
        for (let i = 0; i < text.length; i++)
        {
            modifiedText += `<span id="dialogueSysChar_${i + this.charIndex}" style="color : ${this.textColor}; background : ${this.textBg}; visibility : hidden;">${text[i]}</span>`;
        }
        
        for (let i = 0; i < this.peeps.length; i++)
        {
            if (person == this.peeps[i]) validPeep = true;
        }
        
        if (validPeep != this.SpecialBox)
        {
            if (validPeep)
            {
                this.diaBoxLine.innerHTML = `<img src="${this.imgSrc}/${person}/${face}.png"><span>${modifiedText}</span>`;
                
                this.textBox = this.diaBoxLine.querySelector("span");
                
                sndSrc = `${this.audioSrc}/${person}.ogg`;
            }
            else
            {
                this.diaBoxLine.innerHTML = `<span>${modifiedText}</span>`;
                
                this.textBox = this.diaBoxLine.querySelector("span");
                
                sndSrc = `${this.audioSrc}/default.ogg`;
            }
            
            this.SpecialBox = validPeep;
        }
        else
        {
            if (validPeep)
            {
                this.diaBoxLine.querySelector("img").src = `${this.imgSrc}/${person}/${face}.png`;
                this.textBox.innerHTML += modifiedText;
                
                sndSrc = `${this.audioSrc}/${person}.ogg`;
            }
            else
            {
                this.textBox.innerHTML += modifiedText;
                
                sndSrc = `${this.audioSrc}/default.ogg`;
            }
        }
        
        this.whenTypingFunc();
        
        interval = setInterval(() => {
            var textSnd = new Audio(sndSrc);
            textSnd.volume = this.audioVol;
            var shouldPlaySnd = false;
            
            if (this.charIndex < text.length + this.charIndex)
            {
                this.charIndex++;
                
                let currentChar = document.querySelector(`dialogueSysChar_${this.charIndex}`);
                
                for (let i = 0; i < this.blockedChars.length; i++)
                {
                    if (currentChar.innerHTML != this.blockedChars[i]) shouldPlaySnd = true;
                }
                
                if (shouldPlaySnd) textSnd.play();
                
                currentChar.style.visibility = "visible";
            }
            
            if (index == text.length)
            {
                clearInterval(interval);
                this.notTypingFunc();
                funcAfter();
            }
        }, (24 / speed));
    }
    
    lineBreakBox (amount)
    {
        for (let i = 0; i < amount; i++)
        {
            this.textBox.innerHTML += "<br>";
        }
    }
    
    resetBoxTo (text)
    {
        var modifiedText;
        
        for (let i = 0; i < text.length; i++)
        {
            modifiedText += `<span id="dialogueSysChar_${this.charIndex + i}" style="color : ${this.textColor}; background : ${this.textBg};">${text[i]}</span>`;
        }
        
        this.charIndex += text.length;
        
        this.textBox.innerHTML = modifiedText;
    }
    
    clearBox ()
    {
        this.diaBoxLine.innerHTML = "";
        this.SpecialBox = null;
        this.charIndex = 0;
    }
}